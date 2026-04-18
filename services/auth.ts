"use server";

import { getUserByEmail } from "@/src/db/queries/select";
import { Role } from "@/types";
import { comparePassword } from "@/utils/crypt";
import { insertUser } from "@/src/db/queries/insert";
import { hashPassword } from "@/utils/crypt";

export async function createNewUser(
  city: string,
  dateOfBirth: string,
  email: string,
  firstName: string,
  lastName: string,
  password: string
) {
  const hashedPassword = await hashPassword(password);

  return await insertUser({
    data: {
      city,
      dateOfBirth: new Date(dateOfBirth),
      email,
      firstName,
      lastName,
      password: hashedPassword,
      image: "/profile (1).png",
      role: Role.STUDENT,
    },
    role: Role.STUDENT,
  });
}

export async function authenticateUser(email: string, password: string) {
  try {
    const user = await getUserByEmail(email);

    if (user === null) {
      return {
        success: false,
        message: "Invalid email or password",
        error: "User not found",
        userId: undefined,
        id: undefined,
        role: undefined,
      };
    }
    const isPasswordValid = await comparePassword(password, user.password);

    if (isPasswordValid === false) {
      return {
        success: false,
        message: "Invalid email or password",
        error: "Incorrect password",
        userId: undefined,
        id: undefined,
        role: undefined,
      };
    } else {
      return {
        success: true,
        message: "Login successful",
        error: undefined,
        userId: user.roleId,
        id: user.id,
        role: user.role as Role,
      };
    }
  } catch {
    return {
      success: false,
      message: "An error occurred during authentication",
      error: "Internal server error",
      userId: undefined,
      id: undefined,
      role: undefined,
    };
  }
}
