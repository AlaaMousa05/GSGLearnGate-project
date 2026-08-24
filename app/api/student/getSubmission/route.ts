import { getSubmissionByCourseAndTask } from "@/src/db/queries/select";
import { requireAuth } from "@/context/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId: studentId } = await requireAuth();
    const { courseId, taskId } = await req.json();

    const submission = await getSubmissionByCourseAndTask(
      Number(courseId),
      Number(taskId),
      Number(studentId)
    );

    if (!submission) {
      return NextResponse.json(null, { status: 200 }); // إرجاع null مع حالة 200 إذا لم يتم العثور على السجل
    }

    return NextResponse.json(submission, { status: 200 });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
