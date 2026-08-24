import { config } from "dotenv";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import {
  courseSchedulesTable,
  coursesTable,
  announcementsTable,
  studentsCoursesTable,
  tasksTable,
  submissionsTable,
  attachmentsTable,
  joiningRequestsTable,
  commentsTable,
  coMonitorAvailabilityTable,
  attendanceRecordsTable,
  adminsTable,
  monitorsTable,
  coMonitorsTable,
  studentsTable,
  usersTable,
} from "./src/db/schema";
import { Difficulty, Status, AssignmentStatus, Attachments, Role } from "@/types/index";
import { hashPassword } from "./utils/crypt";

config({ path: ".env" });

// Realistic demo accounts, one per role. Passwords satisfy the app's
// signup validation (8+ chars, at least one letter and one digit).
const DEMO_ACCOUNTS = [
  {
    role: Role.ADMIN,
    email: "demo.admin@example.com",
    password: "DemoAdmin2026",
    firstName: "Rana",
    lastName: "Haddad",
    city: "Gaza",
  },
  {
    role: Role.MONITOR,
    email: "demo.mentor@example.com",
    password: "DemoMentor2026",
    firstName: "Omar",
    lastName: "Jaber",
    city: "Gaza",
  },
  {
    role: Role.CO_MONITOR,
    email: "demo.commentor@example.com",
    password: "DemoCommentor2026",
    firstName: "Lina",
    lastName: "Abu Zayd",
    city: "Khan Younis",
  },
  {
    role: Role.STUDENT,
    email: "demo.student@example.com",
    password: "DemoStudent2026",
    firstName: "Yousef",
    lastName: "Nasser",
    city: "Rafah",
  },
] as const;

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

const roleTable = {
  [Role.ADMIN]: adminsTable,
  [Role.MONITOR]: monitorsTable,
  [Role.CO_MONITOR]: coMonitorsTable,
  [Role.STUDENT]: studentsTable,
};

async function main() {
  const db = drizzle({
    connection: {
      url: process.env.TURSO_CONNECTION_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    },
  });

  // Create (or reuse) one demo user per role, idempotently by email.
  console.log("⏳ Ensuring demo accounts exist...");
  const demoUsers: Record<string, { userId: number; roleRowId: number }> = {};

  for (const account of DEMO_ACCOUNTS) {
    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, account.email))
      .limit(1);

    let userId: number;
    if (existingUser) {
      userId = existingUser.id;
      console.log(`↷ Demo ${account.role} already exists: ${account.email}`);
    } else {
      const hashedPassword = await hashPassword(account.password);
      const [insertedUser] = await db
        .insert(usersTable)
        .values({
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          password: hashedPassword,
          dateOfBirth: new Date("1995-01-01"),
          image: "/avatar-placeholder.png",
          role: account.role,
          city: account.city,
        })
        .returning();
      userId = insertedUser.id;
      console.log(`✅ Created demo ${account.role}: ${account.email}`);
    }

    const table = roleTable[account.role];
    const [existingRoleRow] = await db
      .select()
      .from(table)
      .where(eq(table.userId, userId))
      .limit(1);

    let roleRowId: number;
    if (existingRoleRow) {
      roleRowId = existingRoleRow.id;
    } else {
      const [insertedRoleRow] = await db
        .insert(table)
        .values({ userId })
        .returning();
      roleRowId = insertedRoleRow.id;
    }

    demoUsers[account.role] = { userId, roleRowId };
  }

  const adminRow = { id: demoUsers[Role.ADMIN].roleRowId, userId: demoUsers[Role.ADMIN].userId };
  const monitorRow = { id: demoUsers[Role.MONITOR].roleRowId, userId: demoUsers[Role.MONITOR].userId };
  const coMonitorRow = { id: demoUsers[Role.CO_MONITOR].roleRowId, userId: demoUsers[Role.CO_MONITOR].userId };
  const studentRow = { id: demoUsers[Role.STUDENT].roleRowId, userId: demoUsers[Role.STUDENT].userId };

  const adminUserId = adminRow.userId;
  const monitorUserId = monitorRow.userId;
  const studentUserId = studentRow.userId;

  const [existingDemoCourse] = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.monitorId, monitorRow.id))
    .limit(1);

  if (existingDemoCourse) {
    console.log(
      "↷ Demo course data already exists for the demo monitor — skipping course/task/submission/etc. re-seeding to avoid duplicates."
    );
    console.log("\n✨ Demo accounts are ready.");
    return;
  }

  // 1. Add courses
  console.log("⏳ Inserting courses...");
  const course1Data = {
    title: "Web Development Fundamentals",
    description: "Learn the basics of web development including HTML, CSS, and JavaScript.",
    image:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80",
    difficulty: Difficulty.BEGINNER,
    duration: 30,
    applyStartDate: daysFromNow(-60),
    applyEndDate: daysFromNow(-40),
    courseStartDate: daysFromNow(-24),
    courseEndDate: daysFromNow(36),
    monitorId: monitorRow.id,
    coMonitorId: coMonitorRow.id,
    adminId: adminRow.id,
    details: "Comprehensive introduction to web development.",
    entryRequirements: "Basic computer skills.",
  };

  const [course1] = await db.insert(coursesTable).values(course1Data).returning();
  console.log(`✅ Created course: ${course1.title}`);

  // 2. Add course schedules
  console.log("⏳ Inserting course schedules...");
  const days = ["Saturday", "Monday", "Wednesday"];
  const sessions = [];

  for (let week = 1; week <= 8; week++) {
    for (const day of days) {
      sessions.push({
        courseId: course1.id,
        weekNumber: week,
        dayOfWeek: day,
        startTime: "16:00",
        endTime: "18:00",
        isRecurring: true,
      });
    }
  }

  const [schedule1] = await db.insert(courseSchedulesTable).values(sessions).returning();
  console.log(`✅ Added ${sessions.length} course sessions`);

  // 3. Add announcements
  console.log("⏳ Inserting announcements...");
  const announcements = [
    {
      postedBy: adminUserId,
      courseId: course1.id,
      title: "Welcome to the course",
      description:
        "Welcome everyone to the Web Development course. We hope you have a great learning experience.",
    },
    {
      postedBy: monitorUserId,
      courseId: course1.id,
      title: "Reminder: first lecture schedule",
      description:
        "The first lecture is on Saturday at 4:00 PM. Please make sure to attend on time.",
    },
  ];

  const insertedAnnouncements = await db
    .insert(announcementsTable)
    .values(announcements)
    .returning();
  console.log(`✅ Added ${insertedAnnouncements.length} announcements`);

  // 4. Add joining requests
  console.log("⏳ Inserting joining requests...");
  const joiningRequests = [
    {
      studentId: studentRow.id,
      courseId: course1.id,
      interviewStatus: Status.ACCEPTED,
      joiningStatus: Status.ACCEPTED,
    },
  ];

  const insertedRequests = await db
    .insert(joiningRequestsTable)
    .values(joiningRequests)
    .returning();
  console.log(`✅ Added ${insertedRequests.length} joining requests`);

  // 5. Add students enrollments
  console.log("⏳ Inserting student enrollments...");
  const studentCourses = [
    {
      courseId: course1.id,
      studentId: studentRow.id,
    },
  ];

  const insertedEnrollments = await db
    .insert(studentsCoursesTable)
    .values(studentCourses)
    .returning();
  console.log(`✅ Added ${insertedEnrollments.length} student enrollments`);

  // 6. Add tasks
  console.log("⏳ Inserting tasks...");
  const tasks = [
    {
      title: "HTML Basics",
      description: "Create a simple HTML page with essential elements.",
      creatorId: monitorRow.id,
      courseId: course1.id,
      deadline: daysFromNow(-10),
      points: 10,
    },
    {
      title: "Styling with CSS",
      description: "Apply CSS styling to the previously created HTML page.",
      creatorId: monitorRow.id,
      courseId: course1.id,
      deadline: daysFromNow(6),
      points: 15,
    },
    {
      title: "Practice Exercise: JS Selectors",
      description: "Bonus practice exercise assigned by the co-monitor.",
      creatorId: coMonitorRow.id,
      courseId: course1.id,
      deadline: daysFromNow(4),
      points: 5,
    },
  ];

  const insertedTasks = await db
    .insert(tasksTable)
    .values(tasks)
    .returning();
  console.log(`✅ Added ${insertedTasks.length} tasks`);

  // 7. Add attachments
  console.log("⏳ Inserting attachments...");
  const attachments = [
    {
      taskId: insertedTasks[0].id,
      creatorId: studentRow.id,
      courseId: course1.id,
      type: Attachments.FILE,
      path: "/submissions/layla-html-task.html",
    },
    {
      taskId: insertedTasks[1].id,
      creatorId: studentRow.id,
      courseId: course1.id,
      type: Attachments.FILE,
      path: "/submissions/layla-css-task.html",
    },
  ];

  const insertedAttachments = await db
    .insert(attachmentsTable)
    .values(attachments)
    .returning();
  console.log(`✅ Added ${insertedAttachments.length} attachments`);

  // 8. Add submissions
  console.log("⏳ Inserting submissions...");
  const submissions = [
    {
      taskId: insertedTasks[0].id,
      studentId: studentRow.id,
      courseId: course1.id,
      attachmentId: insertedAttachments[0].id,
      grade: 9,
      feedback: "Excellent work! The page is well structured.",
      gradedAt: new Date(),
      status: AssignmentStatus.GRADED,
    },
    {
      taskId: insertedTasks[1].id,
      studentId: studentRow.id,
      courseId: course1.id,
      attachmentId: insertedAttachments[1].id,
      grade: 14,
      feedback: "Great design! Colors and typography are well balanced.",
      gradedAt: new Date(),
      status: AssignmentStatus.GRADED,
    },
  ];

  const insertedSubmissions = await db
    .insert(submissionsTable)
    .values(submissions)
    .returning();
  console.log(`✅ Added ${insertedSubmissions.length} submissions`);

  // 9. Add comments
  console.log("⏳ Inserting comments...");
  const comments = [
    {
      content: "Great work! Try to improve spacing and alignment a bit more.",
      monitorId: monitorRow.id,
      studentId: studentRow.id,
      courseId: course1.id,
      submissionId: insertedSubmissions[0].id,
      taskId: insertedTasks[0].id,
      isPublic: false,
      privateRecipientId: studentUserId,
    },
    {
      content: "Thanks for the feedback, Fatima! I will improve it in upcoming tasks.",
      studentId: studentRow.id,
      courseId: course1.id,
      submissionId: insertedSubmissions[0].id,
      taskId: insertedTasks[0].id,
      isPublic: false,
      privateRecipientId: monitorUserId,
    },
  ];

  const insertedComments = await db
    .insert(commentsTable)
    .values(comments)
    .returning();
  console.log(`✅ Added ${insertedComments.length} comments`);

  // 10. Add co-monitor availability
  console.log("⏳ Inserting co-monitor availability...");
  const availability = [
    {
      coMonitorId: coMonitorRow.id,
      courseId: course1.id,
      date: daysFromNow(4),
      startTime: "14:00",
      endTime: "16:00",
      isBooked: false,
    },
    {
      coMonitorId: coMonitorRow.id,
      courseId: course1.id,
      date: daysFromNow(2),
      startTime: "17:00",
      endTime: "19:00",
      isBooked: true,
      bookedByStudentId: studentRow.id,
    },
  ];

  const insertedAvailability = await db
    .insert(coMonitorAvailabilityTable)
    .values(availability)
    .returning();
  console.log(`✅ Added ${insertedAvailability.length} availability slots`);

  // 11. Add attendance records
  console.log("⏳ Inserting attendance records...");
  const attendance = [
    {
      sessionId: schedule1.id,
      courseId: course1.id,
      studentId: studentRow.id,
      monitorId: monitorRow.id,
      status: "PRESENT",
      recordedById: monitorUserId,
    },
  ];

  const insertedAttendance = await db
    .insert(attendanceRecordsTable)
    .values(attendance)
    .returning();
  console.log(`✅ Added ${insertedAttendance.length} attendance records`);

  // 12. Add a second, not-yet-started course the demo student hasn't
  // joined, so the "Coming Soon Courses" page has something to show.
  console.log("⏳ Inserting upcoming course...");
  const course2Data = {
    title: "Data Analysis with Python",
    description: "Get started with data analysis using Python, pandas, and visualization tools.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    difficulty: Difficulty.INTERMEDIATE,
    duration: 45,
    applyStartDate: daysFromNow(-5),
    applyEndDate: daysFromNow(20),
    courseStartDate: daysFromNow(30),
    courseEndDate: daysFromNow(75),
    monitorId: monitorRow.id,
    coMonitorId: coMonitorRow.id,
    adminId: adminRow.id,
    details: "Hands-on introduction to data analysis and visualization.",
    entryRequirements: "Basic Python knowledge.",
  };
  const [course2] = await db.insert(coursesTable).values(course2Data).returning();
  console.log(`✅ Created course: ${course2.title}`);

  console.log("\n✨ All seed data inserted successfully!");
  console.log(`
  📊 Insert summary:
  - Courses: 2
  - Course sessions: ${sessions.length}
  - Announcements: ${insertedAnnouncements.length}
  - Joining requests: ${insertedRequests.length}
  - Enrollments: ${insertedEnrollments.length}
  - Tasks: ${insertedTasks.length}
  - Attachments: ${insertedAttachments.length}
  - Submissions: ${insertedSubmissions.length}
  - Comments: ${insertedComments.length}
  - Availability slots: ${insertedAvailability.length}
  - Attendance records: ${insertedAttendance.length}
  `);
}

main().catch(console.error);

/*


src/
├── components/
│   ├── common/               # Reusable UI components
│   │   ├── buttons/
│   │   │   ├── CreateTaskButton.tsx
│   │   │   ├── DayButton.tsx
│   │   ├── cards/
│   │   │   ├── AnnouncementCard.tsx
│   │   │   ├── CourseCard.tsx
│   │   │   ├── PersonCard.tsx
│   │   │   ├── StatisticCard.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskCardCo.tsx
│   │   │   └── TaskCardDetails.tsx
│   │   ├── charts/
│   │   │   └── BarChart.tsx
│   │   ├── forms/
│   │   │   ├── Filter.tsx
│   │   │   ├── Forms.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── SelectOption.tsx
│   │   │   ├── TimePicker.tsx
│   │   │   └── Dropdowns/
│   │   ├── modals/
│   │   │   ├── ApproveModal.tsx
│   │   │   ├── DeleteUserModal.tsx
│   │   │   └── RejectModal.tsx
│   │   ├── tables/
│   │   │   ├── AttendenTabel.tsx
│   │   │   ├── CoursesTable.tsx
│   │   │   └── UsersTables.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── NavLinks.tsx
│   │   ├── SideBar.tsx
│   │   └── Shared.tsx
│   │
│   ├── course/               # Course-related components
│   │   ├── AddCourseForm.tsx
│   │   ├── AddCourseScheduleForm.tsx
│   │   ├── CollectionCourses.tsx
│   │   ├── Course.tsx
│   │   ├── FullCourseCard.tsx
│   │   ├── UpdateCourseForm.tsx
│   │   └── CourseTask/
│   │
│   ├── tasks/                # Task-related components
│   │   ├── Task.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TasksList.tsx
│   │   ├── TaskSubmit.tsx
│   │   └── StatusTaskCards.tsx
│   │
│   ├── announcements/        # Announcement components
│   │   ├── AnnouncementsTable.tsx
│   │   ├── SendAnnouncementForm.tsx
│   │   └── Attachments/
│   │
│   ├── profile/              # User profile components
│   │   ├── EditEmailAddress.tsx
│   │   ├── EditPassword.tsx
│   │   ├── EditPersonalInformation.tsx
│   │   ├── EditProfileImage.tsx
│   │   └── ResetPassword.tsx
│   │
│   ├── auth/                 # Authentication components
│   │   ├── ForgetPassword.tsx
│   │   └── ResetPassword.tsx
│   │
│   ├── calendar/             # Scheduling components
│   │   ├── Calendar.tsx
│   │   ├── SoonLessonsTable.tsx
│   │   ├── SelectStudentAppointmentTime.tsx
│   │   └── StudentAppointmentsTable.tsx
│   │
│   ├── students/             # Student-related components
│   │   ├── StudentRequestsTable.tsx
│   │   ├── StudentSubmissionsTable.tsx
│   │   └── MeetingRequestsTable.tsx
│   │
│   └── monitoring/           # Monitoring components
│       ├── AddMonitorForm.tsx
│       └── TotalCom.tsx
│
├── ...

build
> next build

   ▲ Next.js 15.2.3
   - Environments: .env

   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types    
 ✓ Collecting page data    
 ⚠ Unsupported metadata viewport is configured in metadata export in /forget-password/reset. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /admin/monitors. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /edit-profile. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /forget-password. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /co-monitor. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /login. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /header. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /signup. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /_not-found. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /contact-us. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /admin/add-monitor. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /unauthorized. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /admin/courses. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /admin/add-course. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /admin. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /co-monitor/announcements. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /co-monitor/schedule. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /co-monitor/students. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /co-monitor/announcements/create. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 ⚠ Unsupported metadata viewport is configured in metadata export in /monitor/announcements/create. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
Error occurred prerendering page "/admin". Read more: https://nextjs.org/docs/messages/prerender-error
TypeError: fetch failed
    at node:internal/deps/undici/undici:13392:13
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
Export encountered an error on /(in)/admin/page: /admin, exiting the build.
 ⨯ Next.js build worker exited with code: 1 and signal: null


Monitor: zayd@gmail.com
Password: 12345

Co-monitor: saja@gmail.com
12345

Student: tasneemgazal5@gmail.com 
Tasneem12345

Admin: admin@gmail.com
12345

*/
