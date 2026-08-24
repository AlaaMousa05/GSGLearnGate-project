import TaskCard from "@/components/TaskCard/TaskCard";
import { requireAuth } from "@/context/auth";
import { getTasksByCourseId } from "@/src/db/queries/select";
import { ClipboardText } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

interface IProps {
  params: Promise<{ courseId: string }>;
}
const Tasks = async (props: IProps) => {
  const { courseId } = await props.params;
  const data = await requireAuth();
  const studentId = data.userId;
  const courseTasks = await getTasksByCourseId(Number(courseId));
  const taskCount = courseTasks?.length ?? 0;

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto w-full">
      <Link
        href={`/student/my-courses/${courseId}`}
        className="text-sm text-neutral-500 hover:text-primary transition-colors"
      >
        &larr; Back to course
      </Link>

      <div className="flex items-baseline justify-between gap-4 mt-2 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Tasks & Assignments
        </h1>
        <span className="text-sm font-medium text-neutral-500 shrink-0">
          {taskCount} {taskCount === 1 ? "task" : "tasks"}
        </span>
      </div>

      {taskCount > 0 ? (
        <div className="space-y-4">
          {courseTasks!.map((task) => (
            <TaskCard
              key={task.taskId}
              task={task}
              courseId={courseId}
              studentId={studentId}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center border border-dashed border-gray-200 rounded-2xl bg-white py-16 px-6">
          <ClipboardText size={40} className="text-neutral-300 mb-3" />
          <h2 className="text-lg font-semibold text-gray-700">
            No tasks yet
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Tasks assigned to this course will show up here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Tasks;
