import { StudentCourseTasks, StudentTaskStatus } from "@/types";
import {
  getTaskStatusBadgeClasses,
  getTaskStatusDotClasses,
} from "@/utils/taskStatusStyles";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

interface IProps {
  task: StudentCourseTasks;
  courseId: string;
  studentId: number;
}
const TaskCard = (props: IProps) => {
  const status = props.task.status || StudentTaskStatus.PENDING;
  const isOverdue =
    !props.task.grade && new Date(props.task.deadline) < new Date();

  return (
    <Link
      href={`/student/my-courses/${props.courseId}/tasks/${props.task.taskId}`}
      className="group block w-full"
    >
      <div className="w-full border border-gray-100 rounded-2xl p-5 sm:p-6 bg-white shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
              {props.task.taskTitle}
            </h2>
            <p
              className={`text-sm mt-1 ${
                isOverdue ? "text-red-600 font-medium" : "text-neutral-500"
              }`}
            >
              Deadline: {props.task.deadline.toLocaleDateString("en-GB")}{" "}
              {props.task.deadline.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              {isOverdue && " · Overdue"}
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

        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-neutral-600">
            <span>
              Grade:{" "}
              <span className="font-medium text-neutral-900">
                {props.task.grade ? props.task.grade : "N/A"} /{" "}
                {props.task.maxGrade}
              </span>
            </span>
            {props.task.grade ? (
              <>
                <span>
                  Graded At:{" "}
                  <span className="font-medium text-neutral-900">
                    {props.task.gradedAt.toLocaleDateString("en-GB")}{" "}
                    {props.task.gradedAt.toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </span>
                <span>
                  Graded By:{" "}
                  <span className="font-medium text-neutral-900">
                    {props.task.coMonitor}
                  </span>
                </span>
              </>
            ) : null}
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-primary self-end sm:self-auto">
            View task
            <CaretRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TaskCard;
