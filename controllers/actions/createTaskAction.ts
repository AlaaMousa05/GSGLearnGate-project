"use server";

import { createTaskByCoMonitor, createTaskByMonitor } from "@/services/task";
import { addAttachmentForTask } from "@/services/attachment";
import { Attachments } from "@/types";
import { writeFile } from "@/utils/writeFile";

export type TaskState =
  | { success: false; error: string; message: string; taskId: undefined }
  | { success: true; message: string; taskId: number; error?: undefined };

export async function submitTask(
  state: TaskState,
  formData: FormData
): Promise<TaskState> {
  try {
    const requiredFields = [
      "title",
      "description",
      "dueDate",
      "points",
      "monitorId",
      "courseId",
    ];
    const missingField = requiredFields.find((field) => !formData.get(field));
    if (missingField) {
      return {
        success: false,
        error: "Missing required fields",
        message: "Please provide all the required fields.",
        taskId: undefined,
      };
    }

    const [title, description, dueDate, points, monitorId, courseId] =
      requiredFields.map((field) => formData.get(field) as string);
    const url = (formData.get("url") as string | null)?.trim() || "";
    const deadline = new Date(dueDate);
    const newTask = await createTaskByMonitor(
      Number(monitorId),
      Number(courseId),
      deadline,
      new Date(),
      title,
      description,
      Number(points)
    );
    const file = formData.get("file") as File | null;
    try {
      if (file && file instanceof File && file.size > 0) {
        const path = await writeFile(file);
        await addAttachmentForTask(
          Number(courseId),
          Number(monitorId),
          path,
          newTask.id,
          Attachments.FILE
        );
      } else if (url) {
        await addAttachmentForTask(
          Number(courseId),
          Number(monitorId),
          url,
          newTask.id,
          Attachments.LINK
        );
      }
    } catch {
      // Keep task creation successful even if optional attachment insertion fails.
    }

    return {
      success: true,
      message: "Task creation done.",
      taskId: newTask.id,
    };
  } catch (error) {
    return {
      success: false,
      error: "Something went wrong",
      message: "Task creation failed.",
      taskId: undefined,
    };
  }
}
export async function submitTaskByCoMonitor(
  state: TaskState,
  formData: FormData
): Promise<TaskState> {
  try {
    const requiredFields = [
      "title",
      "description",
      "dueDate",
      "points",
      "coMonitorId",
      "courseId",
    ];
    const missingField = requiredFields.find((field) => !formData.get(field));
    if (missingField) {
      return {
        success: false,
        error: "Missing required fields",
        message: "Please provide all the required fields.",
        taskId: undefined,
      };
    }

    const [title, description, dueDate, points, coMentorId, courseId] =
      requiredFields.map((field) => formData.get(field) as string);
    const url = (formData.get("url") as string | null)?.trim() || "";
    const deadline = new Date(dueDate);
    const newTask = await createTaskByCoMonitor(
      Number(coMentorId),
      Number(courseId),
      deadline,
      new Date(),
      title,
      description,
      Number(points)
    );

    const file = formData.get("file") as File | null;
    try {
      if (file && file instanceof File && file.size > 0) {
        const path = await writeFile(file);
        await addAttachmentForTask(
          Number(courseId),
          Number(coMentorId),
          path,
          newTask.id,
          Attachments.FILE
        );
      } else if (url) {
        await addAttachmentForTask(
          Number(courseId),
          Number(coMentorId),
          url,
          newTask.id,
          Attachments.LINK
        );
      }
    } catch {
      // Keep task creation successful even if optional attachment insertion fails.
    }

    return {
      success: true,
      message: "Task creation done.",
      taskId: newTask.id,
    };
  } catch (error) {
    return {
      success: false,
      error: "Something went wrong",
      message: "Task creation failed.",
      taskId: undefined,
    };
  }
}
