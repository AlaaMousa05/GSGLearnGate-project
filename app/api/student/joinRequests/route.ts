import { insertJoiningRequest } from "@/src/db/queries/insert";
import { requireAuth } from "@/context/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId: studentId } = await requireAuth();
    const body = await req.json();

    const newRequest = await insertJoiningRequest({
      studentId: Number(studentId),
      courseId: Number(body.courseId),
      interviewStatus: body.interviewStatus,
      joiningStatus: body.joiningStatus,
    });

    return NextResponse.json(newRequest, { status: 200 });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
