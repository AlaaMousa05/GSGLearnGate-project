"use server";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/jwt-edge";

export interface DecodedToken {
  email?: string;
  role?: string;
  userId?: number;
  id?: number;
}

export interface AuthUser {
  email: string;
  role: string;
  userId: number;
  id: number;
}

export async function getUserFromToken(
  token: string | null
): Promise<AuthUser | null> {
  if (!token) return null;

  const decodedToken = (await verifyToken(token)) as DecodedToken | null;
  if (decodedToken) {
    return {
      email: decodedToken.email || "",
      role: decodedToken.role || "",
      userId: Number(decodedToken.userId) || -1,
      id: Number(decodedToken.id) || -1,
    };
  }
  return null;
}

export async function requireAuth(): Promise<AuthUser> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let user;
  if (token) {
    user = await getUserFromToken(token);
  }
  if (!user) {
    throw new Error("User not authenticated");
  }

  return user;
}
