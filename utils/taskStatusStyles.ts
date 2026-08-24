import { StudentTaskStatus } from "@/types";

export const taskStatusBadge: Record<string, string> = {
  GRADED: "bg-green-100 text-green-700",
  SUBMITTED: "bg-amber-100 text-amber-700",
  PENDING: "bg-gray-100 text-gray-600",
  LATE: "bg-red-100 text-red-700",
};

export const taskStatusDot: Record<string, string> = {
  GRADED: "bg-green-500",
  SUBMITTED: "bg-amber-500",
  PENDING: "bg-gray-400",
  LATE: "bg-red-500",
};

export function getTaskStatusBadgeClasses(status: string | null | undefined) {
  return taskStatusBadge[status ?? StudentTaskStatus.PENDING] ?? taskStatusBadge.PENDING;
}

export function getTaskStatusDotClasses(status: string | null | undefined) {
  return taskStatusDot[status ?? StudentTaskStatus.PENDING] ?? taskStatusDot.PENDING;
}
