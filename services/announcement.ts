"use server";

import { insertAnnouncement } from "@/src/db/queries/insert";
import { getMonitorAnnouncements } from "@/src/db/queries/select";

export async function sendAnnouncement(
  postedBy: number,
  courseId: number,
  title: string,
  description: string
) {
  return await insertAnnouncement({
    postedBy,
    title,
    courseId,
    description,
  });
}
export async function getAnnouncements(
  courseId: number | undefined,
  courseIds?: number[],
  page: number = 1,
  pageSize: number = 10
) {
  return await getMonitorAnnouncements(courseId, courseIds, page, pageSize);
}
