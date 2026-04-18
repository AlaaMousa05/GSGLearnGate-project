import { expect, test, type BrowserContext, type Page } from "@playwright/test";

const creds = {
  admin: { email: "e2e.admin@gsg.com", password: "E2ePass123!" },
  monitor: { email: "e2e.monitor@gsg.com", password: "E2ePass123!" },
  coMonitor: { email: "e2e.comonitor@gsg.com", password: "E2ePass123!" },
  student: { email: "e2e.student@gsg.com", password: "E2ePass123!" },
};

const publicRoutes = ["/", "/login", "/signup", "/contact-us", "/forget-password"];
const adminRoutes = [
  "/admin",
  "/admin/monitors",
  "/admin/co-monitors",
  "/admin/students",
  "/admin/courses",
  "/admin/announcement",
  "/admin/add-course",
  "/admin/add-monitor",
];
const monitorRoutes = [
  "/monitor",
  "/monitor/announcements",
  "/monitor/announcements/create",
  "/monitor/tasks",
  "/monitor/students",
  "/monitor/joining-requests",
];
const coMonitorRoutes = [
  "/co-monitor",
  "/co-monitor/announcements",
  "/co-monitor/announcements/create",
  "/co-monitor/tasks",
  "/co-monitor/students",
  "/co-monitor/schedule",
  "/co-monitor/availability",
];
const studentRoutes = [
  "/student",
  "/student/announcements",
  "/student/my-courses",
  "/student/coming-soon-courses",
  "/student/appointments",
];

async function installPageGuards(page: Page) {
  const consoleIssues: string[] = [];
  const requestIssues: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      consoleIssues.push(`[${msg.type()}] ${msg.text()}`);
    }
  });

  page.on("response", (res) => {
    const status = res.status();
    if (status >= 400 && !res.url().includes("/_next/")) {
      requestIssues.push(`[${status}] ${res.url()}`);
    }
  });

  return { consoleIssues, requestIssues };
}

async function login(context: BrowserContext, user: { email: string; password: string }) {
  const page = await context.newPage();
  const guards = await installPageGuards(page);

  await page.goto("/login");
  await page.getByLabel("Email address").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForLoadState("networkidle");

  expect(page.url()).not.toContain("/login");
  expect(guards.consoleIssues, guards.consoleIssues.join("\n")).toEqual([]);
  expect(guards.requestIssues, guards.requestIssues.join("\n")).toEqual([]);
  await page.close();
}

async function assertRouteLoads(context: BrowserContext, route: string) {
  const page = await context.newPage();
  const guards = await installPageGuards(page);

  await page.goto(route);
  await page.waitForLoadState("domcontentloaded");
  await expect(page.locator("body")).toBeVisible();
  await expect(page.locator("text=Error: CODE")).toHaveCount(0);
  await expect(page.locator("text=Unhandled Runtime Error")).toHaveCount(0);

  expect(guards.consoleIssues, `${route}\n${guards.consoleIssues.join("\n")}`).toEqual([]);
  expect(guards.requestIssues, `${route}\n${guards.requestIssues.join("\n")}`).toEqual([]);
  await page.close();
}

test("public routes load without runtime/client errors", async ({ page }) => {
  for (const route of publicRoutes) {
    const guards = await installPageGuards(page);
    await page.goto(route);
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator("text=Unhandled Runtime Error")).toHaveCount(0);
    await expect(guards.consoleIssues, `${route}\n${guards.consoleIssues.join("\n")}`).toEqual([]);
    await expect(guards.requestIssues, `${route}\n${guards.requestIssues.join("\n")}`).toEqual([]);
  }
});

test("admin critical routes work", async ({ browser }) => {
  const context = await browser.newContext();
  await login(context, creds.admin);
  for (const route of adminRoutes) {
    await assertRouteLoads(context, route);
  }
  await context.close();
});

test("monitor critical routes work", async ({ browser }) => {
  const context = await browser.newContext();
  await login(context, creds.monitor);
  for (const route of monitorRoutes) {
    await assertRouteLoads(context, route);
  }
  await context.close();
});

test("co-monitor critical routes work", async ({ browser }) => {
  const context = await browser.newContext();
  await login(context, creds.coMonitor);
  for (const route of coMonitorRoutes) {
    await assertRouteLoads(context, route);
  }
  await context.close();
});

test("student critical routes work", async ({ browser }) => {
  const context = await browser.newContext();
  await login(context, creds.student);
  for (const route of studentRoutes) {
    await assertRouteLoads(context, route);
  }
  await context.close();
});
