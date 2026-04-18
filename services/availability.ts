"use server";

import { insertCoMonitorAvailability } from "@/src/db/queries/insert";
import { getAllCoMonitorAppointments } from "@/src/db/queries/select";
import { CoMonitorAppointment } from "@/types/appointments";

export async function addAvailableAppointment(
  coMonitorId: number,
  courseId: number,
  date: Date,
  startTime: string,
  endTime: string
) {
  return await await insertCoMonitorAvailability({
    coMonitorId: coMonitorId,
    courseId: courseId,
    date: date,
    endTime: endTime,
    startTime: startTime,
    isBooked: false,
    bookedByStudentId: null,
  });
}
export async function getCoMonitorAppointmentsList(
  monitorId: number
): Promise<CoMonitorAppointment[]> {
  return getAllCoMonitorAppointments(monitorId);
}
