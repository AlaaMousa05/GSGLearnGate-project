import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/context/auth";
import {
  getCoursesNamesByCoMonitor,
  getCoursesNamesByMonitor,
  getMonitorAnnouncements,
} from "@/src/db/queries/select";
import { Role } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const courseIdParam = searchParams.get("courseId");
    const pageParam = searchParams.get("page");
    const pageSizeParam = searchParams.get("pageSize");

    const courseId = courseIdParam ? Number(courseIdParam) : undefined;
    const page = pageParam ? Number(pageParam) : 1;
    const pageSize = pageSizeParam ? Number(pageSizeParam) : 10;

    if (courseIdParam && Number.isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid courseId" }, { status: 400 });
    }

    const roleBasedCourseIds =
      user.role === Role.MONITOR
        ? (await getCoursesNamesByMonitor(user.userId))?.map((c) => c.courseId)
        : user.role === Role.CO_MONITOR
        ? (await getCoursesNamesByCoMonitor(user.userId))?.map((c) => c.courseId)
        : undefined;

    const result = await getMonitorAnnouncements(
      courseId,
      roleBasedCourseIds,
      page,
      pageSize
    );

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to load announcements" },
      { status: 500 }
    );
  }
}
