import { getAllCoMonitorAppointments } from "@/src/db/queries/select";
import { requireAuth } from "@/context/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await requireAuth();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing coMonitorId" }, { status: 400 });
  }

  const coMonitorId = parseInt(id);
  if (isNaN(coMonitorId)) {
    return NextResponse.json({ error: "Invalid coMonitorId" }, { status: 400 });
  }

  try {
    const appointments = await getAllCoMonitorAppointments(coMonitorId);
    return NextResponse.json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
