import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/jwt-edge";
import { Role } from "@/types";

const protectedRoutes = ["/", "/monitor", "/admin", "/co-monitor", "/student"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  if (isProtected) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyToken(token);

    if (!payload) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = payload.role as string | undefined;

    const currentPath = request.nextUrl.pathname;

    if (currentPath.startsWith("/admin") && role !== Role.ADMIN) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (currentPath.startsWith("/monitor") && role !== Role.MONITOR) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (currentPath.startsWith("/co-monitor") && role !== Role.CO_MONITOR) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (currentPath.startsWith("/student") && role !== Role.STUDENT) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}
