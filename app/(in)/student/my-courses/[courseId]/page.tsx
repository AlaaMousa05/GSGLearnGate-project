import CourseTask from "@/components/CourseTask/CourseTask";
import { requireAuth } from "@/context/auth";
import {
  getCoursesById,
  getStudentAttendanceById,
  getTasksByCourseId,
} from "@/src/db/queries/select";
import Link from "next/link";
import React from "react";

interface IProps {
  params: Promise<{ courseId: string }>;
}
const CourseDetails = async (props: IProps) => {
  const { courseId } = await props.params;
  const data = await requireAuth();
  const studentId = data.userId;
  const courseData = await getCoursesById(Number(courseId));
  const courseTasks = await getTasksByCourseId(Number(courseId));
  const attendancesNumber = await getStudentAttendanceById(
    Number(studentId),
    Number(courseId)
  );

  const today = new Date();
  const courseStartDate = new Date(courseData![0].startDate);
  const courseEndDate = new Date(courseData![0].endDate);

  const getCourseDaysCount = (startDate: Date, endDate: Date) => {
    let courseDaysCount = 0;
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if ([0, 1, 3].includes(dayOfWeek)) {
        courseDaysCount++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return courseDaysCount;
  };

  const courseDaysCount = getCourseDaysCount(courseStartDate, courseEndDate);
  const totalHours = courseDaysCount * 2;
  let completedDays = 0;
  const currentDay = new Date(courseStartDate);

  while (currentDay <= today && currentDay <= courseEndDate) {
    const dayOfWeek = currentDay.getDay();
    if ([0, 1, 3].includes(dayOfWeek)) {
      completedDays++;
    }
    currentDay.setDate(currentDay.getDate() + 1);
  }

  let completedHours = 0;
  if (today < courseStartDate) {
    completedHours = 0;
  } else if (today > courseEndDate) {
    completedHours = totalHours;
  } else {
    completedHours = completedDays * 2;
  }
  const attendance =
    ((attendancesNumber ? attendancesNumber * 2 : 0) / completedHours) * 100;

  return (
    <div className="w-full flex flex-col min-h-screen">
      <header className="w-full bg-white shadow px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Course: {courseData![0].title}
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor: {courseData![0].monitor}
          </p>
          <p className="text-gray-600 mt-1">
            Co-Monitors:{" "}
            <span className="text-gray-600 mt-1">
              {courseData![0].coMonitors}
            </span>
          </p>
        </div>
        <div>
          <Link
            href={`/student/my-courses/${courseId}/booking`}
            className="px-4 py-2 text-sm sm:text-base text-white bg-primary hover:bg-primary-hover rounded-lg font-semibold shadow-md transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Book an interview
          </Link>
        </div>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row">
        <main className="flex-1 p-6">
          <section id="overview" className="mb-10">
            <h2 className="text-2xl font-bold text-primary">Description</h2>
            <p className="text-gray-600 mt-2">{courseData![0].description}</p>
          </section>

          <section id="assignments" className="mb-10">
            <h2 className="text-2xl font-bold text-primary">Assignments</h2>
            <div className="space-y-4">
              {courseTasks && courseTasks.length > 0 ? (
                courseTasks.map((task, index) => {
                  return (
                    <CourseTask
                      key={index}
                      task={task}
                      number={index + 1}
                      courseId={courseId}
                      studentId={studentId}
                    />
                  );
                })
              ) : (
                <h2 className="text-xl font-bold text-gray-800 mt-1">
                  There is No Tasks For this Course
                </h2>
              )}
            </div>
            {courseTasks && (
              <div className="flex justify-center sm:justify-end  mt-4 mb-6">
                <Link
                  href={`/student/my-courses/${courseId}/tasks`}
                  className="px-4 py-2 text-sm sm:text-base text-white bg-primary hover:bg-primary-hover rounded-lg font-semibold shadow-md transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Show Details
                </Link>
              </div>
            )}
          </section>

          <section id="progress" className="mb-10">
            <h2 className="text-2xl font-bold text-primary">Progress</h2>
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-700">Course Completion</p>
                <p className="text-gray-600">
                  {Math.round((completedHours / totalHours) * 100)}%
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: `${Math.round(
                      (completedHours / totalHours) * 100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </section>

          {completedHours !== 0 && (
            <section id="attendance" className="mb-10">
              <h2 className="text-2xl font-bold text-primary">Attendance</h2>
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-700">Attendance Rate</p>
                  <p className="text-gray-600">{Math.round(attendance)}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${Math.round(attendance)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default CourseDetails;
