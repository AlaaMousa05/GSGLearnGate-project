import { expect, test, type BrowserContext, type Page } from "@playwright/test";

const creds = {
  admin: { email: "demo.admin@example.com", password: "DemoAdmin2026" },
  monitor: { email: "demo.mentor@example.com", password: "DemoMentor2026" },
  coMonitor: { email: "demo.commentor@example.com", password: "DemoCommentor2026" },
  student: { email: "demo.student@example.com", password: "DemoStudent2026" },
};

async function login(context: BrowserContext, user: { email: string; password: string }) {
  const page = await context.newPage();
  await page.goto("/login");
  await page.getByLabel("Email address").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 10000 });
  await page.waitForLoadState("networkidle");
  const url = page.url();
  await page.close();
  return url;
}

async function goto(context: BrowserContext, route: string) {
  const page = await context.newPage();
  await page.goto(route);
  await page.waitForLoadState("domcontentloaded");
  const url = page.url();
  await page.close();
  return url;
}

test("demo admin logs in and reaches dashboard, cannot access student area", async ({ browser }) => {
  const context = await browser.newContext();
  const afterLogin = await login(context, creds.admin);
  expect(afterLogin).toContain("/admin");
  const cross = await goto(context, "/student");
  expect(cross).toContain("/unauthorized");
  await context.close();
});

test("demo mentor (monitor) logs in and reaches dashboard, cannot access admin area", async ({ browser }) => {
  const context = await browser.newContext();
  const afterLogin = await login(context, creds.monitor);
  expect(afterLogin).toContain("/monitor");
  const cross = await goto(context, "/admin");
  expect(cross).toContain("/unauthorized");
  await context.close();
});

test("demo commentor (co-monitor) logs in and reaches dashboard, gated by role", async ({ browser }) => {
  const context = await browser.newContext();
  const afterLogin = await login(context, creds.coMonitor);
  expect(afterLogin).toContain("/co-monitor");
  const cross = await goto(context, "/admin");
  expect(cross).toContain("/unauthorized");
  await context.close();
});

test("demo student logs in and reaches dashboard with real course data, cannot access monitor area", async ({ browser }) => {
  const context = await browser.newContext();
  const afterLogin = await login(context, creds.student);
  expect(afterLogin).toContain("/student");

  const page = await context.newPage();
  await page.goto("/student/my-courses");
  await page.waitForLoadState("networkidle");
  await expect(page.locator("body")).toContainText("Web Development Fundamentals");
  await page.close();

  const comingSoon = await context.newPage();
  await comingSoon.goto("/student/coming-soon-courses");
  await comingSoon.waitForLoadState("networkidle");
  await expect(comingSoon.locator("body")).toContainText("Data Analysis with Python");
  await comingSoon.close();

  const cross = await goto(context, "/monitor");
  expect(cross).toContain("/unauthorized");
  await context.close();
});

test("unauthenticated user is redirected away from protected routes", async ({ browser }) => {
  const context = await browser.newContext();
  const url = await goto(context, "/admin");
  expect(url).toContain("/login");
  await context.close();
});
