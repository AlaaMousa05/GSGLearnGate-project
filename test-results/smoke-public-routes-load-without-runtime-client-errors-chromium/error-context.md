# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> public routes load without runtime/client errors
- Location: tests\e2e\smoke.spec.ts:97:5

# Error details

```
Error: /
[warning] Image with src "http://localhost:3002/img/signup-background.svg" has either width or height modified, but not the other. If you use CSS to change the size of your image, also include the styles 'width: "auto"' or 'height: "auto"' to maintain the aspect ratio.

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "[warning] Image with src \"http://localhost:3002/img/signup-background.svg\" has either width or height modified, but not the other. If you use CSS to change the size of your image, also include the styles 'width: \"auto\"' or 'height: \"auto\"' to maintain the aspect ratio.",
+ ]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4] [cursor=pointer]:
        - img "GSG logo" [ref=e5]
        - heading "Gaza Sky Geeks" [level=1] [ref=e6]
      - navigation [ref=e7]:
        - list [ref=e8]:
          - listitem [ref=e9]:
            - link "Home" [ref=e10] [cursor=pointer]:
              - /url: /
          - listitem [ref=e11]:
            - link "About Us" [ref=e12] [cursor=pointer]:
              - /url: /about-us
          - listitem [ref=e13]:
            - link "Contact Us" [ref=e14] [cursor=pointer]:
              - /url: /contact-us
      - generic [ref=e15]:
        - link "Log in" [ref=e16] [cursor=pointer]:
          - /url: /login
        - link "Get started" [ref=e17] [cursor=pointer]:
          - /url: /signup
    - generic [ref=e18]:
      - img "Hero Section" [ref=e19]
      - generic [ref=e21]:
        - heading "Welcome to Gaza Sky Geeks" [level=1] [ref=e22]
        - paragraph [ref=e23]: A wonderful experience awaits you! Enjoy browsing our courses now.
      - img [ref=e25]
    - generic [ref=e28]:
      - generic [ref=e29]:
        - link "Intro to GSGLearnGate cover image Intro to GSGLearnGate BEGINNER Course created by seed script. 30 hrs by Unknown" [ref=e30] [cursor=pointer]:
          - /url: /course-details/1
          - img "Intro to GSGLearnGate cover image" [ref=e32]
          - generic [ref=e33]:
            - paragraph [ref=e34]: Intro to GSGLearnGate
            - paragraph [ref=e35]: BEGINNER
          - paragraph [ref=e36]: Course created by seed script.
          - generic [ref=e37]:
            - img [ref=e38]
            - text: 30 hrs
          - generic [ref=e40]:
            - img [ref=e42]
            - paragraph [ref=e44]: by Unknown
        - link "Web Development Fundamentals cover image Web Development Fundamentals BEGINNER Learn the basics of web development including HTML, CSS, and JavaScript. 30 hrs presenterImage by Fatima Monitor" [ref=e45] [cursor=pointer]:
          - /url: /course-details/2
          - img "Web Development Fundamentals cover image" [ref=e47]
          - generic [ref=e48]:
            - paragraph [ref=e49]: Web Development Fundamentals
            - paragraph [ref=e50]: BEGINNER
          - paragraph [ref=e51]: Learn the basics of web development including HTML, CSS, and JavaScript.
          - generic [ref=e52]:
            - img [ref=e53]
            - text: 30 hrs
          - generic [ref=e55]:
            - img "presenterImage" [ref=e57]
            - paragraph [ref=e58]: by Fatima Monitor
        - link "Web Development Fundamentals cover image Web Development Fundamentals BEGINNER Learn the basics of web development including HTML, CSS, and JavaScript. 30 hrs presenterImage by Fatima Monitor" [ref=e59] [cursor=pointer]:
          - /url: /course-details/3
          - img "Web Development Fundamentals cover image" [ref=e61]
          - generic [ref=e62]:
            - paragraph [ref=e63]: Web Development Fundamentals
            - paragraph [ref=e64]: BEGINNER
          - paragraph [ref=e65]: Learn the basics of web development including HTML, CSS, and JavaScript.
          - generic [ref=e66]:
            - img [ref=e67]
            - text: 30 hrs
          - generic [ref=e69]:
            - img "presenterImage" [ref=e71]
            - paragraph [ref=e72]: by Fatima Monitor
      - generic [ref=e73]:
        - paragraph [ref=e74]: Page 1 of 1
        - generic [ref=e75]:
          - button [disabled] [ref=e76]:
            - img [ref=e77]
          - button "1" [ref=e79] [cursor=pointer]
          - button [disabled] [ref=e80]:
            - img [ref=e81]
    - contentinfo [ref=e83]:
      - generic [ref=e84]:
        - generic [ref=e85]:
          - link "FlowBite Logo Gaza Sky Geeks" [ref=e87] [cursor=pointer]:
            - /url: /
            - img "FlowBite Logo" [ref=e88]
            - generic [ref=e89]: Gaza Sky Geeks
          - generic [ref=e90]:
            - generic [ref=e91]:
              - heading "Resources" [level=2] [ref=e92]
              - list [ref=e93]:
                - listitem [ref=e94]:
                  - link "About Us" [ref=e95] [cursor=pointer]:
                    - /url: /about-us
                - listitem [ref=e96]:
                  - link "Contact Us" [ref=e97] [cursor=pointer]:
                    - /url: /contact-us
            - generic [ref=e98]:
              - heading "Follow us" [level=2] [ref=e99]
              - list [ref=e100]:
                - listitem [ref=e101]:
                  - link "Facebook" [ref=e102] [cursor=pointer]:
                    - /url: https://www.facebook.com/GazaSkyGeeks
                - listitem [ref=e103]:
                  - link "Instagram" [ref=e104] [cursor=pointer]:
                    - /url: https://www.instagram.com/gazaskygeeks/
        - separator [ref=e105]
        - generic [ref=e106]:
          - generic [ref=e107]:
            - text: © 2025
            - link "Gaza Sky Geeks™" [ref=e108] [cursor=pointer]:
              - /url: /
            - text: . All Rights Reserved.
          - generic [ref=e109]:
            - link [ref=e110] [cursor=pointer]:
              - /url: https://www.facebook.com/GazaSkyGeeks
              - img [ref=e111]
            - link [ref=e113] [cursor=pointer]:
              - /url: https://www.instagram.com/gazaskygeeks/
              - img [ref=e114]
  - button "Open Next.js Dev Tools" [ref=e121] [cursor=pointer]:
    - img [ref=e122]
  - alert [ref=e125]
```

# Test source

```ts
  4   |   admin: { email: "e2e.admin@gsg.com", password: "E2ePass123!" },
  5   |   monitor: { email: "e2e.monitor@gsg.com", password: "E2ePass123!" },
  6   |   coMonitor: { email: "e2e.comonitor@gsg.com", password: "E2ePass123!" },
  7   |   student: { email: "e2e.student@gsg.com", password: "E2ePass123!" },
  8   | };
  9   | 
  10  | const publicRoutes = ["/", "/login", "/signup", "/contact-us", "/forget-password"];
  11  | const adminRoutes = [
  12  |   "/admin",
  13  |   "/admin/monitors",
  14  |   "/admin/co-monitors",
  15  |   "/admin/students",
  16  |   "/admin/courses",
  17  |   "/admin/announcement",
  18  |   "/admin/add-course",
  19  |   "/admin/add-monitor",
  20  | ];
  21  | const monitorRoutes = [
  22  |   "/monitor",
  23  |   "/monitor/announcements",
  24  |   "/monitor/announcements/create",
  25  |   "/monitor/tasks",
  26  |   "/monitor/students",
  27  |   "/monitor/joining-requests",
  28  | ];
  29  | const coMonitorRoutes = [
  30  |   "/co-monitor",
  31  |   "/co-monitor/announcements",
  32  |   "/co-monitor/announcements/create",
  33  |   "/co-monitor/tasks",
  34  |   "/co-monitor/students",
  35  |   "/co-monitor/schedule",
  36  |   "/co-monitor/availability",
  37  | ];
  38  | const studentRoutes = [
  39  |   "/student",
  40  |   "/student/announcements",
  41  |   "/student/my-courses",
  42  |   "/student/coming-soon-courses",
  43  |   "/student/appointments",
  44  | ];
  45  | 
  46  | async function installPageGuards(page: Page) {
  47  |   const consoleIssues: string[] = [];
  48  |   const requestIssues: string[] = [];
  49  | 
  50  |   page.on("console", (msg) => {
  51  |     if (msg.type() === "error" || msg.type() === "warning") {
  52  |       consoleIssues.push(`[${msg.type()}] ${msg.text()}`);
  53  |     }
  54  |   });
  55  | 
  56  |   page.on("response", (res) => {
  57  |     const status = res.status();
  58  |     if (status >= 400 && !res.url().includes("/_next/")) {
  59  |       requestIssues.push(`[${status}] ${res.url()}`);
  60  |     }
  61  |   });
  62  | 
  63  |   return { consoleIssues, requestIssues };
  64  | }
  65  | 
  66  | async function login(context: BrowserContext, user: { email: string; password: string }) {
  67  |   const page = await context.newPage();
  68  |   const guards = await installPageGuards(page);
  69  | 
  70  |   await page.goto("/login");
  71  |   await page.getByLabel("Email address").fill(user.email);
  72  |   await page.getByLabel("Password").fill(user.password);
  73  |   await page.getByRole("button", { name: "Sign in" }).click();
  74  |   await page.waitForLoadState("networkidle");
  75  | 
  76  |   expect(page.url()).not.toContain("/login");
  77  |   expect(guards.consoleIssues, guards.consoleIssues.join("\n")).toEqual([]);
  78  |   expect(guards.requestIssues, guards.requestIssues.join("\n")).toEqual([]);
  79  |   await page.close();
  80  | }
  81  | 
  82  | async function assertRouteLoads(context: BrowserContext, route: string) {
  83  |   const page = await context.newPage();
  84  |   const guards = await installPageGuards(page);
  85  | 
  86  |   await page.goto(route);
  87  |   await page.waitForLoadState("domcontentloaded");
  88  |   await expect(page.locator("body")).toBeVisible();
  89  |   await expect(page.locator("text=Error: CODE")).toHaveCount(0);
  90  |   await expect(page.locator("text=Unhandled Runtime Error")).toHaveCount(0);
  91  | 
  92  |   expect(guards.consoleIssues, `${route}\n${guards.consoleIssues.join("\n")}`).toEqual([]);
  93  |   expect(guards.requestIssues, `${route}\n${guards.requestIssues.join("\n")}`).toEqual([]);
  94  |   await page.close();
  95  | }
  96  | 
  97  | test("public routes load without runtime/client errors", async ({ page }) => {
  98  |   for (const route of publicRoutes) {
  99  |     const guards = await installPageGuards(page);
  100 |     await page.goto(route);
  101 |     await page.waitForLoadState("domcontentloaded");
  102 |     await expect(page.locator("body")).toBeVisible();
  103 |     await expect(page.locator("text=Unhandled Runtime Error")).toHaveCount(0);
> 104 |     await expect(guards.consoleIssues, `${route}\n${guards.consoleIssues.join("\n")}`).toEqual([]);
      |                                                                                        ^ Error: /
  105 |     await expect(guards.requestIssues, `${route}\n${guards.requestIssues.join("\n")}`).toEqual([]);
  106 |   }
  107 | });
  108 | 
  109 | test("admin critical routes work", async ({ browser }) => {
  110 |   const context = await browser.newContext();
  111 |   await login(context, creds.admin);
  112 |   for (const route of adminRoutes) {
  113 |     await assertRouteLoads(context, route);
  114 |   }
  115 |   await context.close();
  116 | });
  117 | 
  118 | test("monitor critical routes work", async ({ browser }) => {
  119 |   const context = await browser.newContext();
  120 |   await login(context, creds.monitor);
  121 |   for (const route of monitorRoutes) {
  122 |     await assertRouteLoads(context, route);
  123 |   }
  124 |   await context.close();
  125 | });
  126 | 
  127 | test("co-monitor critical routes work", async ({ browser }) => {
  128 |   const context = await browser.newContext();
  129 |   await login(context, creds.coMonitor);
  130 |   for (const route of coMonitorRoutes) {
  131 |     await assertRouteLoads(context, route);
  132 |   }
  133 |   await context.close();
  134 | });
  135 | 
  136 | test("student critical routes work", async ({ browser }) => {
  137 |   const context = await browser.newContext();
  138 |   await login(context, creds.student);
  139 |   for (const route of studentRoutes) {
  140 |     await assertRouteLoads(context, route);
  141 |   }
  142 |   await context.close();
  143 | });
  144 | 
```