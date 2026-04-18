"use server";
import { Difficulty } from "@/types";
import { editCourse } from "@/services/courses";
import { writeFile } from "@/utils/writeFile";

export type CourseState =
  | { success: false; error: string; message: string }
  | { success: true; message: string; error?: undefined };

export async function submitCourse(
  state: CourseState,
  formData: FormData
): Promise<CourseState> {
  try {
    const courseIdRaw = formData.get("courseId");
    const courseId = Number(courseIdRaw);
    if (!Number.isFinite(courseId) || courseId <= 0) {
      return {
        success: false,
        error: "Invalid course id",
        message: "Course update failed: invalid course id.",
      };
    }

    const parseOptionalId = (value: FormDataEntryValue | null): number | null => {
      if (value === null) return null;
      const str = String(value).trim();
      if (!str) return null;
      const n = Number(str);
      return Number.isFinite(n) && n > 0 ? n : null;
    };

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const difficulty = formData.get("difficulty") as Difficulty;
    const duration = Number(formData.get("duration"));
    const applyStartDate = new Date(formData.get("applyStartDate") as string);
    const applyEndDate = new Date(formData.get("applyEndDate") as string);
    const courseStartDate = new Date(formData.get("courseStartDate") as string);
    const courseEndDate = new Date(formData.get("courseEndDate") as string);
    const monitorId = parseOptionalId(formData.get("monitorId"));
    const coMonitorId = parseOptionalId(formData.get("coMonitorId"));
    const adminId = parseOptionalId(formData.get("adminId"));
    const currentImage = (formData.get("currentImage") as string) || "";
    const details = formData.get("details") as string;
    const entryRequirements = formData.get("entryRequirements") as string;
    if (
      !title ||
      !description ||
      !monitorId ||
      !coMonitorId ||
      !applyStartDate ||
      !applyEndDate ||
      !courseStartDate ||
      !courseEndDate
    ) {
      return {
        success: false,
        error: "Missing required fields",
        message: "Please provide all the required fields.",
      };
    }

    const image = formData.get("image") as File | null;
    let publicFilePath: string = currentImage;

    if (image && image.size > 0) {
      publicFilePath = await writeFile(image);
    }

    await editCourse(courseId, {
      id: courseId,
      title,
      description,
      image: publicFilePath,
      difficulty,
      duration,
      applyStartDate,
      applyEndDate,
      courseStartDate,
      courseEndDate,
      monitorId,
      coMonitorId,
      adminId,
      details,
      entryRequirements,
    });

    return {
      success: true,
      message: "Course updated successfully.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: "Something went wrong",
      message:
        process.env.NODE_ENV === "development"
          ? `Course update failed: ${message}`
          : "Course update failed.",
    };
  }
}
