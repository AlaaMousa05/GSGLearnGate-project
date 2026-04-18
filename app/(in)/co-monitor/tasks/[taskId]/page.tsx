import React from "react";
import CardFooter from "@/components/CardFooter/CardFooter";
import TaskCardDetails from "@/components/TaskCardDetails/TaskCardDetails";
import { getTask } from "@/services/task";
import { Role, Task } from "@/types";
import { getAttachmentForTask } from "@/services/attachment";
import PublicComments from "@/components/Comments/PublicComments";
interface IProps {
  params: Promise<{ taskId: string }>;
}

const page = async ({ params }: IProps) => {
  const { taskId } = await params;
  const task: Task = await getTask(Number(taskId));
  const submission = await getAttachmentForTask(Number(taskId), task.courseId);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold text-[#FFA41F] ">Task Details</h1>
      <div className="border border-orange-100 rounded-lg overflow-hidden">
        <TaskCardDetails
          createdAt={task.createdAt || ""}
          deadline={task.deadline}
          description={task.description}
          lastUpdate={task.updatedAt || ""}
          points={task.points || 0}
          startedAt={task.startedAt}
          taskId={task.id}
          title={task.title}
          paths={submission && submission[0] ? [submission[0].path] : []}
        />

        <PublicComments taskId={Number(taskId)} roles={Role.CO_MONITOR} />

        <CardFooter
          taskId={Number(taskId)}
          Link={"/co-monitor/tasks/students-submissions-list"}
        />
      </div>
    </div>
  );
};

export default page;
