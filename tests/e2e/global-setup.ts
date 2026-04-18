import { eq } from "drizzle-orm";
import { hashPassword } from "../../utils/crypt";
import { db } from "../../src/db";
import {
  adminsTable,
  coMonitorsTable,
  monitorsTable,
  studentsTable,
  usersTable,
} from "../../src/db/schema";
import { Role } from "../../types";

const e2eUsers = [
  {
    role: Role.ADMIN,
    email: "e2e.admin@gsg.com",
    password: "E2ePass123!",
    firstName: "E2E",
    lastName: "Admin",
    city: "Gaza",
  },
  {
    role: Role.MONITOR,
    email: "e2e.monitor@gsg.com",
    password: "E2ePass123!",
    firstName: "E2E",
    lastName: "Monitor",
    city: "Gaza",
  },
  {
    role: Role.CO_MONITOR,
    email: "e2e.comonitor@gsg.com",
    password: "E2ePass123!",
    firstName: "E2E",
    lastName: "CoMonitor",
    city: "Gaza",
  },
  {
    role: Role.STUDENT,
    email: "e2e.student@gsg.com",
    password: "E2ePass123!",
    firstName: "E2E",
    lastName: "Student",
    city: "Gaza",
  },
];

async function createRoleRow(role: Role, userId: number) {
  if (role === Role.ADMIN) {
    await db.insert(adminsTable).values({ userId }).execute();
  } else if (role === Role.MONITOR) {
    await db.insert(monitorsTable).values({ userId }).execute();
  } else if (role === Role.CO_MONITOR) {
    await db.insert(coMonitorsTable).values({ userId }).execute();
  } else if (role === Role.STUDENT) {
    await db.insert(studentsTable).values({ userId }).execute();
  }
}

export default async function globalSetup() {
  for (const user of e2eUsers) {
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, user.email))
      .limit(1);

    if (existing.length > 0) {
      continue;
    }

    const password = await hashPassword(user.password);
    const [newUser] = await db
      .insert(usersTable)
      .values({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password,
        dateOfBirth: new Date("2000-01-01"),
        image: "/img/profile.webp",
        role: user.role,
        city: user.city,
      })
      .returning();

    await createRoleRow(user.role, newUser.id);
  }
}
