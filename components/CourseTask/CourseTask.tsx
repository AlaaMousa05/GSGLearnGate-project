import { StudentCourseTasks, StudentTaskStatus } from "@/types";
import {
  getTaskStatusBadgeClasses,
  getTaskStatusDotClasses,
} from "@/utils/taskStatusStyles";
import Link from "next/link";
import React from "react";

interface IProps {
  task: StudentCourseTasks;
  number: number;
  courseId: string;
  studentId: number;
}
const CourseTask = (props: IProps) => {
  const status = props.task.status || StudentTaskStatus.PENDING;

  return (
    <Link
      href={`/student/my-courses/${props.courseId}/tasks/${props.task.taskId}`}
      className="group block"
    >
      <div className="p-4 bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 rounded-xl flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">
            Assignment {props.number}: {props.task.taskTitle}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Deadline: {props.task.deadline.toLocaleDateString("en-GB")}{" "}
            {props.task.deadline.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${getTaskStatusBadgeClasses(
            status
          )}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${getTaskStatusDotClasses(
              status
            )}`}
          />
          {status}
        </span>
      </div>
    </Link>
  );
};

export default CourseTask;
