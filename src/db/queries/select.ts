"use server";

import {
  eq,
  sql,
  and,
  count,
  lte,
  gt,
  or,
  gte,
  lt,
  inArray,
  asc,
  isNull,
} from "drizzle-orm";

import {
  usersTable,
  adminsTable,
  monitorsTable,
  coMonitorsTable,
  studentsTable,
  coursesTable,
  announcementsTable,
  studentsCoursesTable,
  submissionsTable,
  tasksTable,
  attachmentsTable,
  joiningRequestsTable,
  courseSchedulesTable,
  attendanceRecordsTable,
  coMonitorAvailabilityTable,
  commentsTable,
} from "./../schema";
import {
  Admin,
  Announcement,
  Attachment,
  Attendance,
  CoMonitor,
  Course,
  JoiningRequest,
  Monitor,
  Student,
  StudentCourse,
  Submission,
  Task,
  User,
  MonitorsJoinUsers,
  CourseJoinStudent,
  SubmissionsTask,
  CourseWithNames,
  TaskStatus,
  CourseStatus,
  StudentCourseSmallCard,
  StudentCourseBigCard,
  StudentCourseDetails,
  StudentAppointments,
  StudentCourseTasks,
  StudentCourseTask,
  coMonitorName,
  UsersNames,
  AttendanceRecordStatus,
  PrivateComment,
  SubmissionView,
  SubmissionAttachment,
  CourseWithPresenter,
  AttendanceRecordOne,
  Comments,
  newAnnouncements,
  PublicComment,
  JoiningOrdersResponse,
  Status,
  StudentSubmission,
  Role,
  StudentTaskStatus,
  StudentName,
  SubmissionIdNum,
} from "@/types/index";
import { alias } from "drizzle-orm/sqlite-core";
import { MonitorsTask, MonitorTasksResponse } from "@/types/tasks";
import {
  CourseScheduleList,
  CourseStudentsList,
} from "@/types/attendanceOperations";
import { CoMonitorAppointment } from "@/types/appointments";
import { StudentsListResponse } from "@/types/students";
import { db } from "..";

export async function getAllUsers(): Promise<User[]> {
  return await db.select().from(usersTable).all();
}
export async function getCourseSchedule(
  courseId?: number
): Promise<CourseScheduleList[]> {
  let query = db
    .select({
      id: courseSchedulesTable.id,
      courseId: courseSchedulesTable.courseId,
      courseName: coursesTable.title,
      dayOfWeek: courseSchedulesTable.dayOfWeek,
      startTime: courseSchedulesTable.startTime,
      endTime: courseSchedulesTable.endTime,
    })
    .from(courseSchedulesTable)
    .leftJoin(coursesTable, eq(courseSchedulesTable.courseId, coursesTable.id));

  if (courseId !== undefined) {
    query = query.where(eq(courseSchedulesTable.courseId, courseId));
  }

  return query;
}

export async function getUserByEmail(
  email: string
): Promise<(User & { roleId: number }) | null> {
  const userResult = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (userResult.length === 0) {
    return null;
  }

  const user = userResult[0];
  const { role, id: userId } = user;

  let roleIdQuery;

  switch (role) {
    case Role.ADMIN:
      roleIdQuery = db
        .select({ id: adminsTable.id })
        .from(adminsTable)
        .where(eq(adminsTable.userId, userId));
      break;

    case Role.MONITOR:
      roleIdQuery = db
        .select({ id: monitorsTable.id })
        .from(monitorsTable)
        .where(eq(monitorsTable.userId, userId));
      break;

    case Role.CO_MONITOR:
      roleIdQuery = db
        .select({ id: coMonitorsTable.id })
        .from(coMonitorsTable)
        .where(eq(coMonitorsTable.userId, userId));
      break;

    case Role.STUDENT:
      roleIdQuery = db
        .select({ id: studentsTable.id })
        .from(studentsTable)
        .where(eq(studentsTable.userId, userId));
      break;

    default:
      throw new Error(`Unknown role: ${role}`);
  }

  const roleIdResult = await roleIdQuery.limit(1);
  const roleId = roleIdResult[0]?.id;

  if (!roleId) {
    throw new Error(`User with role ${role} not found in corresponding table`);
  }
  return { ...user, roleId };
}
export async function getAllAdmins(): Promise<Admin[]> {
  return await db.select().from(adminsTable).all();
}

export async function getAllMonitors(): Promise<Monitor[]> {
  return await db.select().from(monitorsTable).all();
}

export async function getMonitorsNames(): Promise<UsersNames[]> {
  return await db
    .select({
      id: monitorsTable.id,
      userId: monitorsTable.userId,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
    })
    .from(monitorsTable)
    .leftJoin(usersTable, eq(usersTable.id, monitorsTable.userId))
    .all();
}

export async function getMonitors(
  page: number = 1,
  pageSize: number = 10
): Promise<{ users: MonitorsJoinUsers[]; totalCount: number } | null> {
  const offset = (page - 1) * pageSize;

  const result = await db
    .select({
      id: monitorsTable.id,
      userId: monitorsTable.userId,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
      dateOfBirth: usersTable.dateOfBirth,
      image: usersTable.image,
      role: usersTable.role,
      city: usersTable.city,
    })
    .from(monitorsTable)
    .leftJoin(usersTable, eq(usersTable.id, monitorsTable.userId))
    .limit(pageSize)
    .offset(offset)
    .all();

  const totalCount = await db
    .select({
      monitorId: monitorsTable.id,
      userId: monitorsTable.userId,
    })
    .from(monitorsTable)
    .leftJoin(usersTable, eq(usersTable.id, monitorsTable.userId))
    .all();

  return { users: result, totalCount: totalCount.length };
}

export async function getAllCoMonitors(): Promise<CoMonitor[]> {
  return await db.select().from(coMonitorsTable).all();
}

export async function getCoMonitorsNames(): Promise<UsersNames[]> {
  return await db
    .select({
      id: coMonitorsTable.id,
      userId: coMonitorsTable.userId,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
    })
    .from(coMonitorsTable)
    .leftJoin(usersTable, eq(usersTable.id, coMonitorsTable.userId))
    .all();
}

export async function getCoMonitors(
  page: number = 1,
  pageSize: number = 10
): Promise<{ users: MonitorsJoinUsers[]; totalCount: number } | null> {
  const offset = (page - 1) * pageSize;
  const result = await db
    .select({
      id: coMonitorsTable.id,
      userId: coMonitorsTable.userId,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
      dateOfBirth: usersTable.dateOfBirth,
      image: usersTable.image,
      role: usersTable.role,
      city: usersTable.city,
    })
    .from(coMonitorsTable)
    .leftJoin(usersTable, eq(usersTable.id, coMonitorsTable.userId))
    .limit(pageSize)
    .offset(offset)
    .all();

  const totalCount = await db
    .select({
      monitorId: coMonitorsTable.id,
      userId: coMonitorsTable.userId,
    })
    .from(coMonitorsTable)
    .leftJoin(usersTable, eq(usersTable.id, coMonitorsTable.userId))
    .all();

  return { users: result, totalCount: totalCount.length };
}

export async function getAllStudents(): Promise<Student[]> {
  return await db.select().from(studentsTable).all();
}

export async function getStudents(
  page: number = 1,
  pageSize: number = 10
): Promise<{ users: MonitorsJoinUsers[]; totalCount: number } | null> {
  const offset = (page - 1) * pageSize;
  const result = await db
    .select({
      id: studentsTable.id,
      userId: studentsTable.userId,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
      dateOfBirth: usersTable.dateOfBirth,
      image: usersTable.image,
      role: usersTable.role,
      city: usersTable.city,
    })
    .from(studentsTable)
    .leftJoin(usersTable, eq(usersTable.id, studentsTable.userId))
    .limit(pageSize)
    .offset(offset)
    .all();

  const totalCount = await db
    .select({
      monitorId: studentsTable.id,
      userId: studentsTable.userId,
    })
    .from(studentsTable)
    .leftJoin(usersTable, eq(usersTable.id, studentsTable.userId))
    .all();

  return { users: result, totalCount: totalCount.length };
}

export async function getAllCourses(): Promise<Course[]> {
  return await db.select().from(coursesTable).all();
}

export async function getCourseById(
  id: number
): Promise<CourseWithNames | null> {
  const monitorUsers = alias(usersTable, "monitorUsers");
  const coMonitorUsers = alias(usersTable, "coMonitorUsers");

  const result = await db
    .select({
      id: coursesTable.id,
      image: coursesTable.image,
      title: coursesTable.title,
      duration: coursesTable.duration,
      description: coursesTable.description,
      entryRequirements: coursesTable.entryRequirements,
      details: coursesTable.details,
      difficulty: coursesTable.difficulty,
      monitorId: coursesTable.monitorId,
      monitorName: monitorUsers.firstName,
      coMonitorId: coursesTable.coMonitorId,
      coMonitorName: coMonitorUsers.firstName,
      adminId: coursesTable.adminId,
      applyStartDate: coursesTable.applyStartDate,
      applyEndDate: coursesTable.applyEndDate,
      courseStartDate: coursesTable.courseStartDate,
      courseEndDate: coursesTable.courseEndDate,
    })
    .from(coursesTable)
    .leftJoin(monitorsTable, eq(coursesTable.monitorId, monitorsTable.id))
    .leftJoin(monitorUsers, eq(monitorsTable.userId, monitorUsers.id))
    .leftJoin(coMonitorsTable, eq(coursesTable.coMonitorId, coMonitorsTable.id))
    .leftJoin(coMonitorUsers, eq(coMonitorsTable.userId, coMonitorUsers.id))
    .where(eq(coursesTable.id, id))
    .get();

  return result || null;
}

export async function getCoursesByStudent(
  studentId: number
): Promise<Course[] | null> {
  const results = await db
    .select({
      id: coursesTable.id,
      title: coursesTable.title,
      description: coursesTable.description,
      image: coursesTable.image,
      difficulty: coursesTable.difficulty,
      duration: coursesTable.duration,
      applyStartDate: coursesTable.applyStartDate,
      applyEndDate: coursesTable.applyEndDate,
      courseStartDate: coursesTable.courseStartDate,
      courseEndDate: coursesTable.courseEndDate,
      monitorId: coursesTable.monitorId,
      coMonitorId: coursesTable.coMonitorId,
      adminId: coursesTable.adminId,
      details: coursesTable.details,
      entryRequirements: coursesTable.entryRequirements,
      createdAt: coursesTable.createdAt,
      updatedAt: coursesTable.updatedAt,
      deletedAt: coursesTable.deletedAt,
    })
    .from(studentsCoursesTable)
    .innerJoin(coursesTable, eq(coursesTable.id, studentsCoursesTable.courseId))
    .where(eq(studentsCoursesTable.studentId, studentId));

  return results.length > 0 ? results : null;
}

export async function getCoursesByMonitor(
  monitorId: number
): Promise<Course[] | null> {
  const results = await db
    .select({
      id: coursesTable.id,
      title: coursesTable.title,
      description: coursesTable.description,
      image: coursesTable.image,
      difficulty: coursesTable.difficulty,
      duration: coursesTable.duration,
      applyStartDate: coursesTable.applyStartDate,
      applyEndDate: coursesTable.applyEndDate,
      courseStartDate: coursesTable.courseStartDate,
      courseEndDate: coursesTable.courseEndDate,
      monitorId: coursesTable.monitorId,
      coMonitorId: coursesTable.coMonitorId,
      adminId: coursesTable.adminId,
      details: coursesTable.details,
      entryRequirements: coursesTable.entryRequirements,
      createdAt: coursesTable.createdAt,
      updatedAt: coursesTable.updatedAt,
      deletedAt: coursesTable.deletedAt,
    })
    .from(coursesTable)
    .where(eq(coursesTable.monitorId, monitorId));

  return results.length > 0 ? results : null;
}

export async function getCoursesNamesByMonitor(
  monitorId: number
): Promise<{ courseId: number; courseName: string }[] | null> {
  const results = await db
    .select({
      title: coursesTable.title,
      id: coursesTable.id,
    })
    .from(coursesTable)
    .where(eq(coursesTable.monitorId, monitorId));
  try {
    return results.map((course: { id: number; title: string }) => ({
      courseId: course.id,
      courseName: course.title,
    }));
  } catch {
    throw new Error("CODE:711");
  }
}

export async function getCoursesNamesByCoMonitor(
  coMonitorId: number
): Promise<{ courseId: number; courseName: string }[] | null> {
  const results = await db
    .select({
      title: coursesTable.title,
      id: coursesTable.id,
    })
    .from(coursesTable)
    .where(eq(coursesTable.coMonitorId, coMonitorId));
  try {
    return results.map((course: { id: number; title: string }) => ({
      courseId: course.id,
      courseName: course.title,
    }));
  } catch {
    throw new Error("CODE:709");
  }
}

export async function getCoursesByCoMonitor(
  coMonitorId: number
): Promise<Course[] | null> {
  const results = await db
    .select({
      id: coursesTable.id,
      title: coursesTable.title,
      description: coursesTable.description,
      image: coursesTable.image,
      difficulty: coursesTable.difficulty,
      duration: coursesTable.duration,
      applyStartDate: coursesTable.applyStartDate,
      applyEndDate: coursesTable.applyEndDate,
      courseStartDate: coursesTable.courseStartDate,
      courseEndDate: coursesTable.courseEndDate,
      monitorId: coursesTable.monitorId,
      coMonitorId: coursesTable.coMonitorId,
      adminId: coursesTable.adminId,
      details: coursesTable.details,
      entryRequirements: coursesTable.entryRequirements,
      createdAt: coursesTable.createdAt,
      updatedAt: coursesTable.updatedAt,
      deletedAt: coursesTable.deletedAt,
    })
    .from(coursesTable)
    .where(eq(coursesTable.coMonitorId, coMonitorId));

  return results.length > 0 ? results : null;
}

export async function getAllAnnouncements(): Promise<Announcement[]> {
  return await db.select().from(announcementsTable).all();
}

export async function getAnnouncementsByCourse(
  courseId: number
): Promise<Announcement[] | null> {
  const results = await db
    .select({
      id: announcementsTable.id,
      title: announcementsTable.title,
      description: announcementsTable.description,
      courseId: announcementsTable.courseId,
      postedBy: announcementsTable.postedBy,
      updatedAt: announcementsTable.updatedAt,
      createdAt: announcementsTable.createdAt,
    })
    .from(announcementsTable)
    .where(eq(announcementsTable.courseId, courseId));

  return results.length > 0 ? results : null;
}

export async function getAllStudentsCourses(): Promise<StudentCourse[]> {
  return await db.select().from(studentsCoursesTable).all();
}

export async function getStudentsByCourse(
  courseId: number
): Promise<Student[] | null> {
  const results = await db
    .select({
      id: studentsTable.id,
      userId: usersTable.id,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
      dateOfBirth: sql<Date>`DATETIME(${usersTable.dateOfBirth}, 'unixepoch')`,
      image: usersTable.image,
      city: usersTable.city,
    })
    .from(studentsCoursesTable)
    .innerJoin(
      studentsTable,
      eq(studentsTable.id, studentsCoursesTable.studentId)
    )
    .innerJoin(usersTable, eq(usersTable.id, studentsTable.userId))
    .where(eq(studentsCoursesTable.courseId, courseId));

  return results.length > 0 ? results : null;
}

export async function getCoursesWithStudentCount(
  page: number = 1,
  pageSize: number = 10
): Promise<{ courses: CourseJoinStudent[]; totalCount: number } | null> {
  const offset = (page - 1) * pageSize;
  const monitorUser = alias(usersTable, "monitorUser");
  const coMonitorUser = alias(usersTable, "coMonitorUser");

  const results = await db
    .select({
      id: coursesTable.id,
      title: coursesTable.title,
      difficulty: coursesTable.difficulty,
      monitorId: coursesTable.monitorId,
      coMonitorId: coursesTable.coMonitorId,
      monitorName: monitorUser.firstName,
      coMonitorName: coMonitorUser.firstName,
      studentCount: sql<number>`COUNT(${studentsCoursesTable.studentId})`.as(
        "studentCount"
      ),
    })
    .from(coursesTable)
    .leftJoin(
      studentsCoursesTable,
      eq(coursesTable.id, studentsCoursesTable.courseId)
    )
    .leftJoin(monitorsTable, eq(coursesTable.monitorId, monitorsTable.id))
    .leftJoin(monitorUser, eq(monitorsTable.userId, monitorUser.id))
    .leftJoin(coMonitorsTable, eq(coursesTable.coMonitorId, coMonitorsTable.id))
    .leftJoin(coMonitorUser, eq(coMonitorsTable.userId, coMonitorUser.id))
    .groupBy(coursesTable.id, monitorUser.firstName, coMonitorUser.firstName)
    .limit(pageSize)
    .offset(offset)
    .all();

  const totalCount = await db
    .select({
      id: coursesTable.id,
      title: coursesTable.title,
      difficulty: coursesTable.difficulty,
      monitorId: monitorsTable.userId,
      monitorName: monitorUser.firstName,
      coMonitorId: coMonitorsTable.userId,
      coMonitorName: coMonitorUser.firstName,
      studentCount: sql<number>`COUNT(${studentsCoursesTable.studentId})`.as(
        "studentCount"
      ),
    })
    .from(coursesTable)
    .leftJoin(
      studentsCoursesTable,
      eq(coursesTable.id, studentsCoursesTable.courseId)
    )
    .leftJoin(monitorsTable, eq(coursesTable.id, monitorsTable.id))
    .leftJoin(monitorUser, eq(monitorsTable.userId, monitorUser.id))
    .leftJoin(coMonitorsTable, eq(coursesTable.id, coMonitorsTable.id))
    .leftJoin(coMonitorUser, eq(coMonitorsTable.userId, coMonitorUser.id))
    .groupBy(coursesTable.id, monitorUser.firstName, coMonitorUser.firstName)
    .all();

  return { courses: results, totalCount: totalCount.length };
}

export async function getMonitorTasksDeadlines(
  userId: number
): Promise<Date[]> {
  const results = await db
    .select({
      deadline: tasksTable.deadline,
    })
    .from(tasksTable)
    .where(eq(tasksTable.creatorId, userId));

  const deadlines = results.map(
    (result: { deadline: string | number | Date }) => new Date(result.deadline)
  );
  return deadlines;
}
export async function getCoMonitorTasksDeadlines(
  userId: number
): Promise<Date[]> {
  const results = await db
    .select({
      deadline: tasksTable.deadline,
    })
    .from(tasksTable)
    .where(eq(tasksTable.creatorId, userId));

  const deadlines = results.map(
    (result: { deadline: string | number | Date }) => new Date(result.deadline)
  );
  return deadlines;
}

export async function getMonitorSubmissionsNotGradedCount(
  userId: number
): Promise<number> {
  const result = await db
    .select({ total: count() })
    .from(submissionsTable)
    .innerJoin(tasksTable, eq(submissionsTable.taskId, tasksTable.id))
    .where(
      and(
        eq(tasksTable.creatorId, userId),
        or(lte(submissionsTable.grade, 0), isNull(submissionsTable.grade))
      )
    );

  return result[0]?.total ?? 0;
}
export async function getCoMonitorSubmissionsNotGradedCount(
  coMonitorId: number
): Promise<number> {
  const result = await db
    .select({ total: count() })
    .from(submissionsTable)
    .innerJoin(coursesTable, eq(submissionsTable.courseId, coursesTable.id))
    .where(
      and(
        eq(coursesTable.coMonitorId, coMonitorId),
        lte(submissionsTable.grade, 0)
      )
    );
  return result[0]?.total || 0;
}

export async function getTasksByMonitor(
  userId: number,
  status: TaskStatus,
  page: number = 1,
  pageSize: number = 10
): Promise<MonitorTasksResponse> {
  const offset = (page - 1) * pageSize;
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);

  const whereCondition = and(
    eq(tasksTable.creatorId, userId),
    status === TaskStatus.IN_PROGRESS
      ? and(
          lte(tasksTable.startedAt, now),
          gte(tasksTable.deadline, new Date())
        )
      : status === TaskStatus.COMPLETED
      ? or(gt(tasksTable.startedAt, now), lt(tasksTable.deadline, new Date()))
      : undefined
  );

  const countQuery = await db
    .select({
      total: sql<number>`count(distinct ${tasksTable.id})`.as("total"),
    })
    .from(tasksTable)
    .where(whereCondition)
    .execute();

  const total = countQuery[0]?.total ?? 0;

  const rawTasks = await db
    .select({
      id: tasksTable.id,
      title: tasksTable.title,
      description: tasksTable.description,
      courseId: tasksTable.courseId,
      startedAt: tasksTable.startedAt,
      deadline: tasksTable.deadline,
      points: tasksTable.points,
      createdAt: tasksTable.createdAt,
      updatedAt: tasksTable.updatedAt,
      courseTitle: coursesTable.title,
      submissionCount: sql<number>`
        (SELECT COUNT(*) FROM ${submissionsTable} 
         WHERE ${submissionsTable.taskId} = ${tasksTable.id}
         AND ${submissionsTable.studentId} IN (
           SELECT ${studentsCoursesTable.studentId}
           FROM ${studentsCoursesTable}
           WHERE ${studentsCoursesTable.courseId} = ${tasksTable.courseId}
         ))
      `.as("submission_count"),
      studentCount: sql<number>`
        (SELECT COUNT(*) FROM ${studentsCoursesTable} 
         WHERE ${studentsCoursesTable.courseId} = ${tasksTable.courseId})
      `.as("student_count"),
    })
    .from(tasksTable)
    .leftJoin(coursesTable, eq(tasksTable.courseId, coursesTable.id))
    .where(whereCondition)
    .limit(pageSize)
    .offset(offset)
    .execute();

  const tasks: MonitorsTask[] = rawTasks.map(
    (task: {
      id: number;
      title: string;
      description: string | null;
      courseId: number;
      startedAt: string;
      deadline: string;
      points: number;
      createdAt: string;
      updatedAt: string;
      courseTitle: string | null;
      submissionCount: number;
      studentCount: number;
    }) => ({
      ...task,
      startedAt: new Date(task.startedAt),
      deadline: new Date(task.deadline),
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      courseTitle: task.courseTitle ?? null,
      description: task.description ?? null,
    })
  );

  return {
    tasks,
    total,
  };
}
export async function getTaskSubmissionStats(
  monitorId: number,
  taskId: number
): Promise<{
  submissionCount: number;
  studentCount: number;
}> {
  const task = await db
    .select({
      courseId: tasksTable.courseId,
    })
    .from(tasksTable)
    .where(and(eq(tasksTable.id, taskId), eq(tasksTable.creatorId, monitorId)))
    .get();

  if (!task) {
    throw new Error("CODE:10008");
  }

  const submissionCountResult = await db
    .select({ count: count() })
    .from(submissionsTable)
    .where(eq(submissionsTable.taskId, taskId))
    .get();

  const studentCountResult = await db
    .select({ count: count() })
    .from(studentsCoursesTable)
    .where(eq(studentsCoursesTable.courseId, task.courseId))
    .get();

  return {
    submissionCount: submissionCountResult?.count ?? 0,
    studentCount: studentCountResult?.count ?? 0,
  };
}
export async function getTaskSubmissionStatsByCoMonitor(
  coMonitorId: number,
  taskId: number
): Promise<{
  submissionCount: number;
  studentCount: number;
}> {
  const task = await db
    .select({
      courseId: tasksTable.courseId,
    })
    .from(tasksTable)
    .where(
      and(eq(tasksTable.id, taskId), eq(tasksTable.creatorId, coMonitorId))
    )
    .get();

  if (!task) {
    throw new Error("CODE:10008");
  }

  const submissionCountResult = await db
    .select({ count: count() })
    .from(submissionsTable)
    .where(eq(submissionsTable.taskId, taskId))
    .get();

  const studentCountResult = await db
    .select({ count: count() })
    .from(studentsCoursesTable)
    .where(eq(studentsCoursesTable.courseId, task.courseId))
    .get();

  return {
    submissionCount: submissionCountResult?.count ?? 0,
    studentCount: studentCountResult?.count ?? 0,
  };
}

export async function getTasksByCoMonitor(
  userId: number,
  status: TaskStatus,
  page: number = 1,
  pageSize: number = 10
): Promise<MonitorTasksResponse> {
  const offset = (page - 1) * pageSize;
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);

  const whereCondition = and(
    eq(tasksTable.creatorId, userId),
    status === TaskStatus.IN_PROGRESS
      ? and(
          lte(tasksTable.startedAt, now),
          gte(tasksTable.deadline, new Date())
        )
      : status === TaskStatus.COMPLETED
      ? or(gt(tasksTable.startedAt, now), lt(tasksTable.deadline, new Date()))
      : undefined
  );

  const countQuery = await db
    .select({
      total: sql<number>`count(distinct ${tasksTable.id})`.as("total"),
    })
    .from(tasksTable)
    .where(whereCondition)
    .execute();

  const total = countQuery[0]?.total ?? 0;

  const rawTasks = await db
    .select({
      id: tasksTable.id,
      title: tasksTable.title,
      description: tasksTable.description,
      courseId: tasksTable.courseId,
      startedAt: tasksTable.startedAt,
      deadline: tasksTable.deadline,
      points: tasksTable.points,
      createdAt: tasksTable.createdAt,
      updatedAt: tasksTable.updatedAt,
      courseTitle: coursesTable.title,
      submissionCount: sql<number>`
        (SELECT COUNT(*) FROM ${submissionsTable} 
         WHERE ${submissionsTable.taskId} = ${tasksTable.id}
         AND ${submissionsTable.studentId} IN (
           SELECT ${studentsCoursesTable.studentId}
           FROM ${studentsCoursesTable}
           WHERE ${studentsCoursesTable.courseId} = ${tasksTable.courseId}
         ))
      `.as("submission_count"),
      studentCount: sql<number>`
        (SELECT COUNT(*) FROM ${studentsCoursesTable} 
         WHERE ${studentsCoursesTable.courseId} = ${tasksTable.courseId})
      `.as("student_count"),
    })
    .from(tasksTable)
    .leftJoin(coursesTable, eq(tasksTable.courseId, coursesTable.id))
    .where(whereCondition)
    .limit(pageSize)
    .offset(offset)
    .execute();

  const tasks: MonitorsTask[] = rawTasks.map(
    (task: {
      id: number;
      title: string;
      description: string | null;
      courseId: number;
      startedAt: string;
      deadline: string;
      points: number;
      createdAt: string;
      updatedAt: string;
      courseTitle: string | null;
      submissionCount: number;
      studentCount: number;
    }) => ({
      ...task,
      startedAt: new Date(task.startedAt),
      deadline: new Date(task.deadline),
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      courseTitle: task.courseTitle ?? null,
      description: task.description ?? null,
    })
  );

  return {
    tasks,
    total,
  };
}

export async function getStudentCountByCourse(courseId: number) {
  const result = await db
    .select({ count: count() })
    .from(studentsCoursesTable)
    .where(eq(studentsCoursesTable.courseId, courseId));
  return result[0]?.count || 0;
}

export async function getAllSubmissions(): Promise<Submission[]> {
  return await db.select().from(submissionsTable).all();
}

export async function getAllJoiningRequestsWithDetails(
  monitorId: number,
  courseId: number | undefined,
  page: number = 1,
  pageSize: number = 10
): Promise<JoiningOrdersResponse> {
  const offset = (page - 1) * pageSize;
  const whereConditions = [eq(coursesTable.monitorId, monitorId)];
  if (courseId !== undefined) {
    whereConditions.push(eq(coursesTable.id, courseId));
  }

  const totalCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(joiningRequestsTable)
    .leftJoin(coursesTable, eq(joiningRequestsTable.courseId, coursesTable.id))
    .leftJoin(
      studentsTable,
      eq(joiningRequestsTable.studentId, studentsTable.id)
    )
    .leftJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .where(and(...whereConditions))
    .get();

  const totalCount = totalCountResult?.count ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const results = await db
    .select({
      id: joiningRequestsTable.id,
      courseName: coursesTable.title,
      courseId: coursesTable.id,
      studentId: usersTable.id,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
      image: usersTable.image,
      interviewStatus: joiningRequestsTable.interviewStatus,
      joiningStatus: joiningRequestsTable.joiningStatus,
    })
    .from(joiningRequestsTable)
    .leftJoin(coursesTable, eq(joiningRequestsTable.courseId, coursesTable.id))
    .leftJoin(
      studentsTable,
      eq(joiningRequestsTable.studentId, studentsTable.id)
    )
    .leftJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .where(and(...whereConditions))
    .limit(pageSize)
    .offset(offset)
    .all();
  return {
    totalPages,
    JoiningOrders: results.map((result: any) => ({
      id: result.id,
      courseId: result.courseId,
      studentId: result.studentId,
      courseName: result.courseName ?? "Unknown Course",
      firstName: result.firstName ?? "Unknown",
      lastName: result.lastName,
      email: result.email,
      image: result.image,
      interviewStatus: result.interviewStatus,
      joiningStatus: result.joiningStatus,
    })),
  };
}
export async function getSubmissionsByCourse(
  courseId: number
): Promise<Submission[] | null> {
  const results = await db
    .select({
      id: submissionsTable.id,
      taskId: submissionsTable.taskId,
      studentId: submissionsTable.studentId,
      courseId: submissionsTable.courseId,
      grade: submissionsTable.grade,
      feedback: submissionsTable.feedback,
      gradedAt: submissionsTable.gradedAt,
      status: submissionsTable.status,
      createdAt: submissionsTable.createdAt,
      updatedAt: submissionsTable.updatedAt,
      deletedAt: submissionsTable.deletedAt,
    })
    .from(submissionsTable)
    .where(eq(submissionsTable.courseId, courseId));

  return results.length > 0 ? results : null;
}

export async function getAllAttachments(): Promise<Attachment[]> {
  return await db.select().from(attachmentsTable).all();
}

export async function getAllAttendances(): Promise<Attendance[]> {
  return await db.select().from(attendanceRecordsTable).all();
}

export async function getAllJoiningRequests(): Promise<JoiningRequest[]> {
  return await db.select().from(joiningRequestsTable).all();
}

export async function updateJoiningRequest(
  id: number,
  updates: Partial<JoiningRequest>
): Promise<JoiningRequest[]> {
  return await db
    .update(joiningRequestsTable)
    .set(updates)
    .where(eq(joiningRequestsTable.id, id))
    .returning();
}

export async function getSubmissionsAndNonSubmissionsForTask(
  taskId: number,
  courseId: number,
  page: number = 1,
  pageSize: number = 10
): Promise<{ submissions: SubmissionsTask[]; totalCount: number }> {
  const offset = (page - 1) * pageSize;

  const taskAndCourse = await db
    .select({
      taskName: tasksTable.title,
      courseName: coursesTable.title,
      points: tasksTable.points,
    })
    .from(tasksTable)
    .innerJoin(coursesTable, eq(tasksTable.courseId, coursesTable.id))
    .where(and(eq(tasksTable.id, taskId), eq(coursesTable.id, courseId)))
    .all();

  const taskName = taskAndCourse[0]?.taskName || "Unknown Task";
  const courseName = taskAndCourse[0]?.courseName || "Unknown Course";
  const point = taskAndCourse[0]?.points || 0;
  const submissions = await db
    .select({
      submissionId: submissionsTable.id,
      studentId: studentsTable.id,
      studentName: sql<string>`${usersTable.firstName} || ' ' || ${usersTable.lastName}`,
      email: usersTable.email,
      submissionDate: submissionsTable.createdAt,
      status: submissionsTable.status,
      grade: submissionsTable.grade,
      profilePicture: usersTable.image,
      taskName: tasksTable.title,
      courseName: coursesTable.title,
      taskId: submissionsTable.taskId,
      points: tasksTable.points,
    })
    .from(submissionsTable)
    .leftJoin(studentsTable, eq(submissionsTable.studentId, studentsTable.id))
    .leftJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .leftJoin(tasksTable, eq(submissionsTable.taskId, tasksTable.id))
    .leftJoin(coursesTable, eq(tasksTable.courseId, coursesTable.id))
    .where(eq(submissionsTable.taskId, taskId))
    .groupBy(
      submissionsTable.id,
      studentsTable.id,
      usersTable.id,
      tasksTable.id,
      coursesTable.id
    )
    .all();

  const allStudentsInCourse = await db
    .select({
      studentId: studentsTable.id,
      studentName: sql<string>`${usersTable.firstName} || ' ' || ${usersTable.lastName}`,
      email: usersTable.email,
      profilePicture: usersTable.image,
    })
    .from(studentsCoursesTable)
    .innerJoin(
      studentsTable,
      eq(studentsCoursesTable.studentId, studentsTable.id)
    )
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .where(eq(studentsCoursesTable.courseId, courseId))
    .all();

  const submittedStudentIds = submissions.map(
    (submission: { studentId: number }) => submission.studentId
  );
  const nonSubmissions = allStudentsInCourse
    .filter(
      (student: { studentId: number }) =>
        !submittedStudentIds.includes(student.studentId)
    )
    .map(
      (student: {
        studentId: number;
        studentName: string;
        email: string | null;
        profilePicture: string | null;
      }) => ({
        submissionId: `non-${student.studentId}`,
        studentId: student.studentId,
        studentName: student.studentName,
        email: student.email ?? "",
        submissionDate: "__",
        status: "NOT SUBMITTED",
        grade: 0,
        profilePicture: student.profilePicture ?? "",
        taskName: taskName,
        courseName: courseName,
        taskId: taskId,
        points: point,
      })
    );

  const combinedResults = [...submissions, ...nonSubmissions];

  const paginatedResults = combinedResults.slice(offset, offset + pageSize);

  return {
    submissions: paginatedResults as SubmissionsTask[],
    totalCount: combinedResults.length,
  };
}

export async function getLateSubmissionsCountByMonitor(userId: number) {
  const result = await db
    .select({ count: count() })
    .from(submissionsTable)
    .innerJoin(tasksTable, eq(submissionsTable.taskId, tasksTable.id))
    .innerJoin(coursesTable, eq(submissionsTable.courseId, coursesTable.id))
    .where(
      and(
        eq(tasksTable.creatorId, userId),
        gt(submissionsTable.createdAt, tasksTable.deadline)
      )
    );

  return result[0]?.count ?? 0;
}
export async function getLateSubmissionsCountByCoMonitor(userId: number) {
  const result = await db
    .select({ count: count() })
    .from(submissionsTable)
    .innerJoin(tasksTable, eq(submissionsTable.taskId, tasksTable.id))
    .innerJoin(coursesTable, eq(submissionsTable.courseId, coursesTable.id))
    .where(
      and(
        eq(tasksTable.creatorId, userId),
        gt(submissionsTable.createdAt, tasksTable.deadline)
      )
    );

  return result[0]?.count ?? 0;
}

export async function getTaskById(taskId: number): Promise<Task> {
  const task = await db
    .select()
    .from(tasksTable)
    .where(eq(tasksTable.id, taskId))
    .limit(1);

  return task[0] || null;
}

export async function getLimitCoursesByStudent(
  studentId: number,
  limit?: number
): Promise<StudentCourseSmallCard[] | null> {
  const results = await db
    .selectDistinct({
      id: coursesTable.id,
      title: coursesTable.title,
      monitorName: sql<string>`${usersTable.firstName} || ' ' || ${usersTable.lastName}`,
      duration: coursesTable.duration,
      startDate: coursesTable.courseStartDate,
      endDate: coursesTable.courseEndDate,
    })
    .from(studentsCoursesTable)
    .innerJoin(coursesTable, eq(coursesTable.id, studentsCoursesTable.courseId))
    .innerJoin(monitorsTable, eq(coursesTable.monitorId, monitorsTable.id))
    .innerJoin(usersTable, eq(monitorsTable.userId, usersTable.id))
    .where(eq(studentsCoursesTable.studentId, studentId))
    .groupBy(
      coursesTable.id,
      coursesTable.title,
      usersTable.firstName,
      usersTable.lastName,
      coursesTable.duration
    )
    .limit(limit);

  return results.length > 0 ? results : null;
}

export async function getCoursesDataByStudent(
  studentId: number
): Promise<StudentCourseBigCard[] | null> {
  const results = await db
    .selectDistinct({
      id: coursesTable.id,
      title: coursesTable.title,
      monitorName: sql<string>`${usersTable.firstName} || ' ' || ${usersTable.lastName}`,
      startDate: coursesTable.courseStartDate,
      endDate: coursesTable.courseEndDate,
      duration: coursesTable.duration,
      status: sql<CourseStatus>`CASE
      WHEN ${coursesTable.courseStartDate} > CAST(strftime('%s','now') AS INTEGER) THEN 'Not Started'
      WHEN ${coursesTable.courseEndDate} < CAST(strftime('%s','now') AS INTEGER) THEN 'Finished'
      ELSE 'In Progress'
      END`,
      totalTasks: sql<number>`(SELECT COUNT(*) FROM ${tasksTable} WHERE course_id = ${coursesTable.id})`,
      completedTasks: sql<number>`(SELECT COUNT(*) FROM ${submissionsTable} WHERE course_id = ${coursesTable.id} AND status = 'SUBMITTED' AND student_id = ${studentId})`,
    })
    .from(studentsCoursesTable)
    .innerJoin(coursesTable, eq(coursesTable.id, studentsCoursesTable.courseId))
    .innerJoin(monitorsTable, eq(coursesTable.monitorId, monitorsTable.id))
    .innerJoin(usersTable, eq(monitorsTable.userId, usersTable.id))
    .where(eq(studentsCoursesTable.studentId, studentId))
    .groupBy(
      coursesTable.id,
      coursesTable.title,
      usersTable.firstName,
      usersTable.lastName
    );

  return results.length > 0 ? results : null;
}

const monitorUsers = alias(usersTable, "monitor_users");
const coMonitorsUsers = alias(usersTable, "co_monitor_users");
export async function getCoursesById(
  courseId: number
): Promise<StudentCourseDetails[]> {
  const results = await db
    .selectDistinct({
      id: coursesTable.id,
      title: coursesTable.title,
      monitor: sql<string>`${monitorUsers.firstName} || ' ' || ${monitorUsers.lastName}`,
      description: coursesTable.description,
      coMonitors: sql<string>`${coMonitorsUsers.firstName} || ' ' || ${coMonitorsUsers.lastName}`,
      startDate: coursesTable.courseStartDate,
      endDate: coursesTable.courseEndDate,
      applyEndDate: coursesTable.applyEndDate,
      details: coursesTable.details,
      entryRequirements: coursesTable.entryRequirements,
      duration: coursesTable.duration,
    })
    .from(coursesTable)
    .innerJoin(
      studentsCoursesTable,
      eq(coursesTable.id, studentsCoursesTable.courseId)
    )
    .innerJoin(monitorsTable, eq(coursesTable.monitorId, monitorsTable.id))
    .innerJoin(monitorUsers, eq(monitorsTable.userId, monitorUsers.id))
    .innerJoin(
      coMonitorsTable,
      eq(coursesTable.coMonitorId, coMonitorsTable.id)
    )
    .innerJoin(coMonitorsUsers, eq(coMonitorsTable.userId, coMonitorsUsers.id))
    .where(eq(coursesTable.id, courseId));

  return results;
}
export async function getCoursesByStudentId(
  courseId: number
): Promise<StudentCourseDetails[]> {
  const results = await db
    .selectDistinct({
      id: coursesTable.id,
      title: coursesTable.title,
      monitor: sql<string>`${monitorUsers.firstName} || ' ' || ${monitorUsers.lastName}`,
      description: coursesTable.description,
      coMonitors: sql<string>`${coMonitorsUsers.firstName} || ' ' || ${coMonitorsUsers.lastName}`,
      startDate: coursesTable.courseStartDate,
      endDate: coursesTable.courseEndDate,
      applyEndDate: coursesTable.applyEndDate,
      details: coursesTable.details,
      entryRequirements: coursesTable.entryRequirements,
      duration: coursesTable.duration,
    })
    .from(coursesTable)
    .innerJoin(monitorsTable, eq(coursesTable.monitorId, monitorsTable.id))
    .innerJoin(monitorUsers, eq(monitorsTable.userId, monitorUsers.id))
    .innerJoin(
      coMonitorsTable,
      eq(coursesTable.coMonitorId, coMonitorsTable.id)
    )
    .innerJoin(coMonitorsUsers, eq(coMonitorsTable.userId, coMonitorsUsers.id))
    .where(eq(coursesTable.id, courseId));

  return results;
}

export async function getStudentAppointments(
  studentId: number
): Promise<StudentAppointments[] | null> {
  const results = await db
    .selectDistinct({
      id: coMonitorAvailabilityTable.id,
      coMonitor: sql<string>`${usersTable.firstName} || ' ' || ${usersTable.lastName}`,
      date: coMonitorAvailabilityTable.date,
      startTime: coMonitorAvailabilityTable.startTime,
      courseTitle: coursesTable.title,
    })
    .from(coMonitorAvailabilityTable)
    .innerJoin(
      studentsTable,
      eq(studentsTable.id, coMonitorAvailabilityTable.bookedByStudentId)
    )
    .innerJoin(
      coMonitorsTable,
      eq(coMonitorsTable.id, coMonitorAvailabilityTable.coMonitorId)
    )
    .innerJoin(usersTable, eq(coMonitorsTable.userId, usersTable.id))
    .innerJoin(
      coursesTable,
      eq(coursesTable.id, coMonitorAvailabilityTable.courseId)
    )
    .where(eq(studentsTable.id, studentId));

  return results.length > 0 ? results : null;
}

export async function getMonitorAnnouncements(
  courseId: number | undefined,
  courseIds?: number[],
  page: number = 1,
  pageSize: number = 10
): Promise<{ announcements: Announcement[] | null; total: number }> {
  let allResults: Announcement[];

  if (courseId !== undefined) {
    allResults = await db
      .select()
      .from(announcementsTable)
      .where(eq(announcementsTable.courseId, courseId))
      .all();
  } else if (courseIds && courseIds.length > 0) {
    allResults = await db
      .select()
      .from(announcementsTable)
      .where(inArray(announcementsTable.courseId, courseIds))
      .all();
  } else {
    return { announcements: null, total: 0 };
  }

  const total = allResults.length;

  const offset = (page - 1) * pageSize;
  const paginatedResults = allResults.slice(offset, offset + pageSize);

  return {
    announcements: paginatedResults.length > 0 ? paginatedResults : null,
    total,
  };
}
export async function getTasksByCourseId(
  courseId: number
): Promise<StudentCourseTasks[] | null> {
  const results = await db
    .selectDistinct({
      taskId: tasksTable.id,
      taskTitle: tasksTable.title,
      deadline: tasksTable.deadline,
      status: submissionsTable.status || StudentTaskStatus.PENDING,
      grade: submissionsTable.grade,
      gradedAt: submissionsTable.gradedAt,
      maxGrade: tasksTable.points,
      coMonitor: sql<string>`${usersTable.firstName} || ' ' || ${usersTable.lastName}`,
    })
    .from(tasksTable)
    .innerJoin(coursesTable, eq(coursesTable.id, tasksTable.courseId))
    .leftJoin(coMonitorsTable, eq(coursesTable.coMonitorId, coMonitorsTable.id))
    .leftJoin(usersTable, eq(coMonitorsTable.userId, usersTable.id))
    .leftJoin(submissionsTable, eq(tasksTable.id, submissionsTable.taskId))
    .leftJoin(studentsTable, eq(studentsTable.id, submissionsTable.studentId))
    .where(eq(coursesTable.id, courseId));

  return results.length > 0 ? results : null;
}

export async function getUserById(
  id: number
): Promise<Omit<User, "password"> | null> {
  const result = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, Number(id)))
    .get();
  return result || null;
}

export async function getTaskByTaskId(
  taskId: number
): Promise<StudentCourseTask[] | null> {
  const results = await db
    .selectDistinct({
      courseTitle: coursesTable.title,
      taskTitle: tasksTable.title,
      creator: sql<string>`${usersTable.firstName} || ' ' || ${usersTable.lastName}`,
      createdAt: tasksTable.createdAt,
      updatedAt: tasksTable.updatedAt,
      description: tasksTable.description,
      deadline: tasksTable.deadline,
    })
    .from(tasksTable)
    .innerJoin(coursesTable, eq(coursesTable.id, tasksTable.courseId))
    .innerJoin(usersTable, eq(usersTable.id, tasksTable.creatorId))
    .where(eq(tasksTable.id, taskId));

  return results.length > 0 ? results : null;
}

export async function getCoMonitorByCourseId(
  courseId: number
): Promise<coMonitorName[] | null> {
  const results = await db
    .selectDistinct({
      coMonitorId: coMonitorsTable.id,
      coMonitorName: sql<string>`${usersTable.firstName} || ' ' || ${usersTable.lastName}`,
    })
    .from(coursesTable)
    .innerJoin(
      coMonitorsTable,
      eq(coMonitorsTable.id, coursesTable.coMonitorId)
    )
    .innerJoin(usersTable, eq(usersTable.id, coMonitorsTable.userId))
    .where(eq(coursesTable.id, courseId));

  return results.length > 0 ? results : null;
}
export async function getStudentsByCourseId(
  courseId: number
): Promise<CourseStudentsList[]> {
  const students = await db
    .select({
      id: studentsTable.id,
      userId: studentsTable.userId,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
      image: usersTable.image,
    })
    .from(studentsCoursesTable)
    .innerJoin(
      studentsTable,
      eq(studentsCoursesTable.studentId, studentsTable.id)
    )
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .where(eq(studentsCoursesTable.courseId, courseId))
    .all();

  return students;
}

export async function insertAttendanceRecord({
  sessionId,
  courseId,
  studentId,
  status,
  recordedById,
}: {
  sessionId: number;
  courseId: number;
  studentId: number;
  status: AttendanceRecordStatus;
  recordedById: number;
}) {
  const existing = await db
    .select()
    .from(attendanceRecordsTable)
    .where(
      and(
        eq(attendanceRecordsTable.sessionId, sessionId),
        eq(attendanceRecordsTable.studentId, studentId)
      )
    )
    .get();

  if (existing) {
    return await db
      .update(attendanceRecordsTable)
      .set({
        status,
        recordedById,
        updatedAt: sql`(current_timestamp)`,
      })
      .where(
        and(
          eq(attendanceRecordsTable.sessionId, sessionId),
          eq(attendanceRecordsTable.studentId, studentId)
        )
      )
      .returning()
      .get();
  }

  return await db
    .insert(attendanceRecordsTable)
    .values({
      sessionId,
      courseId,
      studentId,
      status,
      recordedById,
      createdAt: sql`(current_timestamp)`,
      updatedAt: sql`(current_timestamp)`,
      deletedAt: sql`(current_timestamp)`,
    })
    .returning()
    .get();
}

export async function getAllCoMonitorAppointments(
  coMonitorId: number
): Promise<CoMonitorAppointment[]> {
  return await db
    .select({
      id: coMonitorAvailabilityTable.id,
      date: coMonitorAvailabilityTable.date,
      startTime: coMonitorAvailabilityTable.startTime,
      endTime: coMonitorAvailabilityTable.endTime,
      isBooked: coMonitorAvailabilityTable.isBooked,
      course: {
        id: coursesTable.id,
        title: coursesTable.title,
      },
      student: {
        id: studentsTable.id,
        userId: studentsTable.userId,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
      },
    })
    .from(coMonitorAvailabilityTable)
    .leftJoin(
      coursesTable,
      eq(coMonitorAvailabilityTable.courseId, coursesTable.id)
    )
    .leftJoin(
      studentsTable,
      eq(coMonitorAvailabilityTable.bookedByStudentId, studentsTable.id)
    )
    .leftJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .where(eq(coMonitorAvailabilityTable.coMonitorId, coMonitorId))
    .all();
}

export async function getSubmissionById(submissionId: number): Promise<{
  submission: SubmissionView | null;
  attachments: SubmissionAttachment;
}> {
  const result = await db
    .select({
      id: submissionsTable.id,
      taskId: submissionsTable.taskId,
      studentId: submissionsTable.studentId,
      courseId: submissionsTable.courseId,
      grade: submissionsTable.grade,
      feedback: submissionsTable.feedback,
      gradedAt: submissionsTable.gradedAt,
      status: submissionsTable.status,
      createdAt: submissionsTable.createdAt,
      updatedAt: submissionsTable.updatedAt,
      deletedAt: submissionsTable.deletedAt,
      StudentName: sql<string>`${usersTable.firstName} || ' ' || ${usersTable.lastName}`,
      StudentEmail: usersTable.email,
      StudentImage: usersTable.image,
      TaskTitle: tasksTable.title,
      points: tasksTable.points,
    })
    .from(submissionsTable)
    .leftJoin(studentsTable, eq(submissionsTable.studentId, studentsTable.id))
    .leftJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .leftJoin(tasksTable, eq(submissionsTable.taskId, tasksTable.id))
    .where(eq(submissionsTable.id, submissionId))
    .get();

  if (!result) {
    return {
      submission: null,
      attachments: {
        attachmentId: 0,
        attachmentPath: "",
        attachmentType: undefined,
      },
    };
  }

  const submission: SubmissionView = {
    ...result,
    createdAt: new Date(result.createdAt),
    updatedAt: new Date(result.updatedAt),
    deletedAt: result.deletedAt ? new Date(result.deletedAt) : null,
    gradedAt: result.gradedAt ? new Date(result.gradedAt) : null,
  };

  const attachmentsResult = await db
    .select({
      attachmentId: attachmentsTable.id,
      attachmentPath: attachmentsTable.path,
      attachmentType: attachmentsTable.type,
    })
    .from(attachmentsTable)
    .innerJoin(
      submissionsTable,
      eq(attachmentsTable.id, submissionsTable.attachmentId)
    )
    .where(eq(submissionsTable.id, submissionId))
    .all();

  return {
    submission,
    attachments: attachmentsResult[0] || {
      attachmentId: 0,
      attachmentPath: "",
      attachmentType: undefined,
    },
  };
}
export async function getPrivateCommentsBySubmission(
  submissionId: number
): Promise<PrivateComment[]> {
  const submission = await db
    .select({
      studentId: submissionsTable.studentId,
    })
    .from(submissionsTable)
    .where(eq(submissionsTable.id, submissionId))
    .get();

  if (!submission) {
    throw new Error("CODE:700");
  }

  const comments = await db
    .select({
      commentId: commentsTable.id,
      commentText: commentsTable.content,
      createdAt: commentsTable.createdAt,
      createdBy: sql<string>`${usersTable.firstName} || ' ' || ${usersTable.lastName}`,
      image: usersTable.image,
    })
    .from(commentsTable)
    .innerJoin(usersTable, eq(commentsTable.studentId, usersTable.id))
    .where(
      and(
        eq(commentsTable.submissionId, submissionId),
        eq(commentsTable.studentId, submission.studentId),
        eq(commentsTable.isPublic, false)
      )
    )
    .orderBy(commentsTable.createdAt);

  return comments.map(
    (comment: {
      commentId: number;
      commentText: string;
      createdAt: string;
      createdBy: string;
      image: string | null;
    }) => ({
      ...comment,
      createdAt: new Date(comment.createdAt),
    })
  );
}
export async function getPrivateCommentsReplyBySubmission(
  submissionId: number,
  ComentorId: number
): Promise<PrivateComment[]> {
  const comments = await db
    .select({
      commentId: commentsTable.id,
      commentText: commentsTable.content,
      createdAt: commentsTable.createdAt,
      createdBy: sql<string>`${usersTable.firstName} || ' ' || ${usersTable.lastName}`,
      image: usersTable.image,
    })
    .from(commentsTable)
    .innerJoin(usersTable, eq(commentsTable.coMonitorId, usersTable.id))
    .where(
      and(
        eq(commentsTable.submissionId, submissionId),
        eq(commentsTable.coMonitorId, ComentorId),
        eq(commentsTable.isPublic, false)
      )
    )
    .orderBy(commentsTable.createdAt);

  return comments.map(
    (comment: {
      commentId: number;
      commentText: string;
      createdAt: string;
      createdBy: string;
      image: string | null;
    }) => ({
      ...comment,
      createdAt: new Date(comment.createdAt),
    })
  );
}

export async function getAllCoursesWithMonitors(): Promise<Course[]> {
  const results = await db
    .select({
      id: coursesTable.id,
      title: coursesTable.title,
      description: coursesTable.description,
      image: coursesTable.image,
      difficulty: coursesTable.difficulty,
      duration: coursesTable.duration,
      applyStartDate: coursesTable.applyStartDate,
      applyEndDate: coursesTable.applyEndDate,
      courseStartDate: coursesTable.courseStartDate,
      courseEndDate: coursesTable.courseEndDate,
      monitorId: coursesTable.monitorId,
      coMonitorId: coursesTable.coMonitorId,
      adminId: coursesTable.adminId,
      details: coursesTable.details,
      entryRequirements: coursesTable.entryRequirements,
      createdAt: coursesTable.createdAt,
      updatedAt: coursesTable.updatedAt,
      deletedAt: coursesTable.deletedAt,

      monitorUserId: monitorsTable.userId,
      monitorFirstName: usersTable.firstName,
      monitorLastName: usersTable.lastName,
      monitorImage: usersTable.image,
    })
    .from(coursesTable)
    .leftJoin(monitorsTable, eq(coursesTable.monitorId, monitorsTable.id))
    .leftJoin(usersTable, eq(monitorsTable.userId, usersTable.id));

  return results.map((course: any) => ({
    ...course,
    presenterName: course.monitorFirstName
      ? `${course.monitorFirstName} ${course.monitorLastName}`
      : "Unknown",
    presenterImage: course.monitorImage || null,
  }));
}

export async function getCourseWithMonitor(
  id: number
): Promise<CourseWithPresenter> {
  const results = await db
    .select({
      id: coursesTable.id,
      title: coursesTable.title,
      description: coursesTable.description,
      image: coursesTable.image,
      difficulty: coursesTable.difficulty,
      duration: coursesTable.duration,
      applyStartDate: coursesTable.applyStartDate,
      applyEndDate: coursesTable.applyEndDate,
      courseStartDate: coursesTable.courseStartDate,
      courseEndDate: coursesTable.courseEndDate,
      monitorId: coursesTable.monitorId,
      coMonitorId: coursesTable.coMonitorId,
      adminId: coursesTable.adminId,
      details: coursesTable.details,
      entryRequirements: coursesTable.entryRequirements,
      createdAt: coursesTable.createdAt,
      updatedAt: coursesTable.updatedAt,
      deletedAt: coursesTable.deletedAt,

      monitorUserId: monitorsTable.userId,
      monitorFirstName: usersTable.firstName,
      monitorLastName: usersTable.lastName,
      monitorImage: usersTable.image,
    })
    .from(coursesTable)
    .leftJoin(monitorsTable, eq(coursesTable.monitorId, monitorsTable.id))
    .leftJoin(usersTable, eq(monitorsTable.userId, usersTable.id))
    .where(eq(coursesTable.id, id))
    .get();

  return {
    ...results,
    presenterName: results.monitorFirstName
      ? `${results.monitorFirstName} ${results.monitorLastName}`
      : "Unknown",
    presenterImage: results.monitorImage || null,
  };
}

export async function getStudentAttendanceById(
  studentId: number,
  courseId: number
): Promise<number | null> {
  const results: AttendanceRecordOne[] = await db
    .select({
      attendanceStatus: attendanceRecordsTable.status,
    })
    .from(attendanceRecordsTable)
    .innerJoin(
      courseSchedulesTable,
      eq(courseSchedulesTable.id, attendanceRecordsTable.sessionId)
    )
    .innerJoin(
      coursesTable,
      eq(coursesTable.id, attendanceRecordsTable.courseId)
    )
    .innerJoin(
      studentsTable,
      eq(studentsTable.id, attendanceRecordsTable.studentId)
    )
    .where(and(eq(studentsTable.id, studentId), eq(coursesTable.id, courseId)));

  if (results.length === 0) return null;

  const presentCount = results.filter(
    (item: AttendanceRecordOne) => item.attendanceStatus !== "ABSENT"
  ).length;

  return presentCount;
}

export async function getCommentsByTaskId(
  courseId: number,
  TaskId: number
): Promise<Comments[] | null> {
  const comments = await db
    .select({
      id: commentsTable.id,
      content: commentsTable.content,
      userName: sql<string>`${usersTable.firstName} || ' ' || ${usersTable.lastName}`,
      isPublic: commentsTable.isPublic,
      createdAt: commentsTable.createdAt,
      submissionId: commentsTable.submissionId,
    })
    .from(commentsTable)
    .innerJoin(studentsTable, eq(studentsTable.id, commentsTable.studentId))
    .innerJoin(usersTable, eq(usersTable.id, studentsTable.userId))
    .innerJoin(coursesTable, eq(coursesTable.id, commentsTable.courseId))
    .innerJoin(tasksTable, eq(tasksTable.id, commentsTable.taskId))
    .where(and(eq(coursesTable.id, courseId), eq(tasksTable.id, TaskId)))
    .all();

  return comments ? comments : null;
}

export async function getSubmissionIdByTaskId(
  courseId: number,
  TaskId: number
): Promise<{ submissionId: number }[] | null> {
  const SubmissionId = await db
    .select({
      submissionId: submissionsTable.id,
    })
    .from(submissionsTable)
    .innerJoin(tasksTable, eq(tasksTable.id, submissionsTable.taskId))
    .innerJoin(coursesTable, eq(coursesTable.id, tasksTable.courseId))
    .where(and(eq(coursesTable.id, courseId), eq(tasksTable.id, TaskId)));

  return SubmissionId ? SubmissionId : null;
}

export async function getStudentAnnouncementsById(
  studentId: number
): Promise<newAnnouncements[] | null> {
  const results = await db
    .select({
      id: announcementsTable.id,
      postedBy: sql<string>`${usersTable.firstName} || ' ' || ${usersTable.lastName}`,
      courseId: coursesTable.id,
      title: announcementsTable.title,
      description: announcementsTable.description,
      createdAt: announcementsTable.createdAt,
      courseTitle: coursesTable.title,
    })
    .from(announcementsTable)
    .innerJoin(usersTable, eq(usersTable.id, announcementsTable.postedBy))
    .innerJoin(coursesTable, eq(coursesTable.id, announcementsTable.courseId))
    .innerJoin(
      studentsCoursesTable,
      eq(coursesTable.id, studentsCoursesTable.courseId)
    )
    .where(eq(studentsCoursesTable.studentId, studentId));

  return results.length > 0 ? results : null;
}

export async function getPublicCommentsByTaskId(
  taskId: number
): Promise<PublicComment[]> {
  const publicComments = await db
    .select({
      commentId: commentsTable.id,
      commentText: commentsTable.content,
      createdAt: commentsTable.createdAt,
      isPublic: commentsTable.isPublic,
      userName: sql<string>`${usersTable.firstName} || ' ' || ${usersTable.lastName}`,
      userEmail: usersTable.email,
      userImage: usersTable.image,
      userType: sql<string>`CASE
        WHEN ${commentsTable.studentId} IS NOT NULL THEN 'Student'
        WHEN ${commentsTable.coMonitorId} IS NOT NULL THEN 'Co-Mentor'
        WHEN ${commentsTable.monitorId} IS NOT NULL THEN 'Mentor'
        ELSE 'Unknown'
      END`,
      userId: sql<number>`CASE
        WHEN ${commentsTable.studentId} IS NOT NULL THEN ${studentsTable.userId}
        WHEN ${commentsTable.coMonitorId} IS NOT NULL THEN ${coMonitorsTable.userId}
        WHEN ${commentsTable.monitorId} IS NOT NULL THEN ${monitorsTable.userId}
        ELSE NULL
      END`,
    })
    .from(commentsTable)
    .leftJoin(studentsTable, eq(commentsTable.studentId, studentsTable.id))
    .leftJoin(
      coMonitorsTable,
      eq(commentsTable.coMonitorId, coMonitorsTable.id)
    )
    .leftJoin(monitorsTable, eq(commentsTable.monitorId, monitorsTable.id))
    .innerJoin(
      usersTable,
      sql`
      ${usersTable.id} = COALESCE(
        ${studentsTable.userId},
        ${coMonitorsTable.userId},
        ${monitorsTable.userId}
      )
    `
    )
    .where(
      and(eq(commentsTable.taskId, taskId), eq(commentsTable.isPublic, true))
    )
    .orderBy(asc(commentsTable.createdAt));

  return publicComments;
}

export async function getAttachmentPathsByTaskId(
  taskId: number,
  courseId: number
): Promise<StudentSubmission[] | null> {
  const attachments = await db
    .select({
      path: attachmentsTable.path,
      feedback: submissionsTable.feedback,
    })
    .from(attachmentsTable)
    .innerJoin(
      submissionsTable,
      eq(attachmentsTable.id, submissionsTable.attachmentId)
    )
    .innerJoin(coursesTable, eq(coursesTable.id, submissionsTable.courseId))
    .where(
      and(
        eq(attachmentsTable.taskId, taskId),
        eq(attachmentsTable.courseId, courseId)
      )
    );
  return attachments ? attachments : null;
}

export async function getStudentsListByCourseId(
  courseId?: number,
  page: number = 1,
  itemsPerPage: number = 10,
  monitorId?: number,
  coMonitorId?: number
): Promise<StudentsListResponse> {
  try {
    if (!courseId && !monitorId && !coMonitorId) {
      throw new Error("CODE:701");
    }

    let countQuery = db
      .select({ count: count() })
      .from(studentsCoursesTable)
      .innerJoin(
        studentsTable,
        eq(studentsCoursesTable.studentId, studentsTable.id)
      )
      .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
      .innerJoin(
        coursesTable,
        eq(studentsCoursesTable.courseId, coursesTable.id)
      );

    let studentsQuery = db
      .select({
        id: studentsTable.id,
        userId: studentsTable.userId,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
        email: usersTable.email,
        image: usersTable.image,
        courseId: coursesTable.id,
        courseTitle: coursesTable.title,
      })
      .from(studentsCoursesTable)
      .innerJoin(
        studentsTable,
        eq(studentsCoursesTable.studentId, studentsTable.id)
      )
      .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
      .innerJoin(
        coursesTable,
        eq(studentsCoursesTable.courseId, coursesTable.id)
      )
      .limit(itemsPerPage)
      .offset((page - 1) * itemsPerPage);

    if (courseId) {
      countQuery = countQuery.where(
        eq(studentsCoursesTable.courseId, courseId)
      );
      studentsQuery = studentsQuery.where(
        eq(studentsCoursesTable.courseId, courseId)
      );
    } else {
      if (monitorId) {
        countQuery = countQuery.where(eq(coursesTable.monitorId, monitorId));
        studentsQuery = studentsQuery.where(
          eq(coursesTable.monitorId, monitorId)
        );
      } else if (coMonitorId) {
        countQuery = countQuery.where(
          eq(coursesTable.coMonitorId, coMonitorId)
        );
        studentsQuery = studentsQuery.where(
          eq(coursesTable.coMonitorId, coMonitorId)
        );
      }
    }

    const totalStudentsResult = await countQuery;
    const totalStudents = totalStudentsResult[0]?.count || 0;
    const totalPages = Math.ceil(totalStudents / itemsPerPage);

    const students = await studentsQuery;
    return {
      students,
      totalPages,
    };
  } catch {
    throw new Error("CODE:702");
  }
}

export async function getStudentsCountByMonitor(
  monitorId: number
): Promise<number> {
  const result = await db
    .select({ count: count() })
    .from(studentsCoursesTable)
    .innerJoin(coursesTable, eq(studentsCoursesTable.courseId, coursesTable.id))
    .where(eq(coursesTable.monitorId, monitorId));

  return result[0]?.count || 0;
}

export async function getCoursesCountByMonitor(
  monitorId: number
): Promise<number> {
  const result = await db
    .select({ count: count() })
    .from(coursesTable)
    .where(eq(coursesTable.monitorId, monitorId));

  return result[0]?.count || 0;
}
export async function getCoursesWithStudentCounts(
  monitorId: number
): Promise<{ course: string; students: number }[]> {
  const results = await db
    .select({
      course: coursesTable.title,
      students: count(studentsCoursesTable.studentId),
    })
    .from(coursesTable)
    .leftJoin(
      studentsCoursesTable,
      eq(coursesTable.id, studentsCoursesTable.courseId)
    )
    .where(eq(coursesTable.monitorId, monitorId))
    .groupBy(coursesTable.id, coursesTable.title);

  return results;
}
export async function getCoursesWithStudentCountsByCoMonitor(
  coMonitorId: number
): Promise<{ course: string; students: number }[]> {
  const results = await db
    .select({
      course: coursesTable.title,
      students: count(studentsCoursesTable.studentId),
    })
    .from(coursesTable)
    .leftJoin(
      studentsCoursesTable,
      eq(coursesTable.id, studentsCoursesTable.courseId)
    )
    .where(eq(coursesTable.coMonitorId, coMonitorId))
    .groupBy(coursesTable.id, coursesTable.title);

  return results;
}

export async function getNotStartedCoursesNotRegisteredByStudent(
  studentId: number
): Promise<StudentCourseBigCard[] | null> {
  const monitorUsersTable = alias(usersTable, "monitor_users");

  const results = await db
    .selectDistinct({
      id: coursesTable.id,
      title: coursesTable.title,
      monitorName: sql<string>`${monitorUsersTable.firstName} || ' ' || ${monitorUsersTable.lastName}`,
      startDate: coursesTable.courseStartDate,
      endDate: coursesTable.courseEndDate,
      duration: coursesTable.duration,
      status: sql<CourseStatus>`'Not Started'`,
      totalTasks: sql<number>`(SELECT COUNT(*) FROM ${tasksTable} WHERE course_id = ${coursesTable.id})`,
      completedTasks: sql<number>`0`,
      applyEndDate: coursesTable.applyEndDate,
      description: coursesTable.description,
      details: coursesTable.details,
      entryRequirements: coursesTable.entryRequirements,
    })
    .from(coursesTable)
    .leftJoin(
      studentsCoursesTable,
      eq(studentsCoursesTable.courseId, coursesTable.id)
    )
    .leftJoin(
      studentsTable,
      eq(studentsTable.id, studentsCoursesTable.studentId)
    )
    .leftJoin(usersTable, eq(studentsTable.userId, usersTable.id)) // الطالب
    .leftJoin(monitorsTable, eq(monitorsTable.id, coursesTable.monitorId))
    .leftJoin(monitorUsersTable, eq(monitorUsersTable.id, monitorsTable.userId)) // المونيتور
    .where(
      and(
        gt(
          coursesTable.courseStartDate,
          sql<number>`CAST(strftime('%s','now') AS INTEGER)`
        ),
        sql<boolean>`${coursesTable.id} NOT IN (
          SELECT ${studentsCoursesTable.courseId}
          FROM ${studentsCoursesTable}
          WHERE ${studentsCoursesTable.studentId} = ${studentId}
        )`
      )
    );

  return results.length > 0 ? results : null;
}

export async function getJoiningRequestStatus(
  studentId: number,
  courseId: number
): Promise<Status | null> {
  const results = await db
    .select({
      status: joiningRequestsTable.joiningStatus,
    })
    .from(joiningRequestsTable)
    .innerJoin(
      studentsTable,
      eq(studentsTable.id, joiningRequestsTable.studentId)
    )
    .innerJoin(coursesTable, eq(coursesTable.id, joiningRequestsTable.courseId))
    .where(
      and(
        eq(joiningRequestsTable.studentId, studentId),
        eq(joiningRequestsTable.courseId, courseId)
      )
    );

  return results.length > 0 ? results : null;
}
export async function getTotalStudentsByCoMonitor(
  coMonitorId: number
): Promise<number> {
  const result = await db
    .select({ totalStudents: count(studentsCoursesTable.studentId) })
    .from(studentsCoursesTable)
    .innerJoin(coursesTable, eq(studentsCoursesTable.courseId, coursesTable.id))
    .where(eq(coursesTable.coMonitorId, coMonitorId))
    .get();

  return result?.totalStudents || 0;
}
export async function getTotalCoursesByCoMonitor(
  coMonitorId: number
): Promise<number> {
  const result = await db
    .select({ totalCourses: count(coursesTable.id) })
    .from(coursesTable)
    .where(eq(coursesTable.coMonitorId, coMonitorId))
    .get();

  return result?.totalCourses || 0;
}
export async function getTotalTasksByCoMonitor(
  coMonitorId: number
): Promise<number> {
  const result = await db
    .select({ totalTasks: count(tasksTable.id) })
    .from(tasksTable)
    .innerJoin(coursesTable, eq(tasksTable.courseId, coursesTable.id))
    .where(eq(coursesTable.coMonitorId, coMonitorId))
    .get();

  return result?.totalTasks || 0;
}
export async function getCoMonitorUserDetails(
  coMonitorId: number
): Promise<User | null> {
  const result = await db
    .select({
      id: usersTable.id,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
      dateOfBirth: usersTable.dateOfBirth,
      image: usersTable.image,
      role: usersTable.role,
      city: usersTable.city,
      createdAt: usersTable.createdAt,
      updatedAt: usersTable.updatedAt,
    })
    .from(coMonitorsTable)
    .innerJoin(usersTable, eq(coMonitorsTable.userId, usersTable.id))
    .where(eq(coMonitorsTable.id, coMonitorId))
    .get();

  return result || null;
}
export async function getStudentNameById(
  studentId: number
): Promise<StudentName[]> {
  const result = await db
    .select({
      id: studentsTable.id,
      name: sql<string>`${usersTable.firstName} || ' ' || ${usersTable.lastName}`,
    })
    .from(studentsTable)
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
    .where(eq(studentsTable.id, studentId));
  return result;
}

export async function getSubmissionByCourseAndTask(
  courseId: number,
  taskId: number
): Promise<SubmissionIdNum | null> {
  const result = await db
    .select({
      id: submissionsTable.id,
    })
    .from(submissionsTable)
    .innerJoin(coursesTable, eq(coursesTable.id, submissionsTable.courseId))
    .innerJoin(tasksTable, eq(tasksTable.courseId, coursesTable.id))
    .where(and(eq(tasksTable.id, taskId), eq(coursesTable.id, courseId)));
  return result ? result[0] : null;
}
