import { writeFile } from "@/utils/writeFile";
import { requireAuth } from "@/context/auth";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export async function POST(req: Request) {
  await requireAuth();

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  try {
    const url = await writeFile(file);
    return NextResponse.json({ url }, { status: 200 });
  } catch (err) {
    console.error("File upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
