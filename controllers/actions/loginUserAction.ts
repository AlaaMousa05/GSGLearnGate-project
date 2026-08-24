"use server";
import { authenticateUser } from "@/services/auth";
import { Role } from "@/types";
import { generateToken } from "@/utils/auth";
import { cookies } from "next/headers";

export type LoginUserStatus =
  | {
      success: false;
      message: string;
      error: string;
      userId: undefined;
      id: undefined;
      role: undefined;
    }
  | {
      success: true;
      message: string;
      error?: string;
      userId: number | undefined;
      id?: number | undefined;
      role: Role | undefined;
    };

export async function loginUser(
  state: LoginUserStatus,
  formData: FormData
): Promise<LoginUserStatus> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  if (!email || !password) {
    return {
      success: false,
      message: "Please fill all the fields",
      error: "Please fill all the fields",
      userId: undefined,
      id: undefined,
      role: undefined,
    };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: "Invalid email format",
      error: "Invalid email format",
      userId: undefined,
      id: undefined,
      role: undefined,
    };
  }
  const authenticatedUser = await authenticateUser(email, password);
  if (!authenticatedUser) {
    return {
      success: false,
      message: "Invalid email or password",
      error: "Invalid email or password",
      userId: undefined,
      id: undefined,
      role: undefined,
    };
  } else {
    const token = generateToken({ userId: authenticatedUser.userId, email, role:authenticatedUser.role, id: authenticatedUser.id });

    const cookieStore = await cookies();
    // NOTE: not httpOnly because context/user.tsx (AuthProvider) decodes this
    // cookie client-side to populate the logged-in user in ~13 components/hooks.
    // Authorization no longer trusts this cookie's contents (see middleware.ts /
    // context/auth.ts, which verify the JWT signature server-side instead).
    cookieStore.set("token", token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    cookieStore.set("role", String(authenticatedUser.role), {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return {
      success: true,
      message: "Login Successfully",
      userId: authenticatedUser.userId,
      id: authenticatedUser.id,
      role: authenticatedUser.role,
    };
  }
}
