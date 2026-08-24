import CourseCard from "@/components/CourseCard/CourseCard";
import React from "react";
import SoonLessonsTable from "@/components/SoonLessonsTable/SoonLessonsTable";
import Link from "next/link";
import { getLimitCoursesByStudent } from "@/src/db/queries/select";
import { requireAuth } from "@/context/auth";

const Dashboard = async () => {
  const data = await requireAuth();
  const studentId = data.userId;

  const courses = await getLimitCoursesByStudent(Number(studentId), 2);

  const totalCourses = await getLimitCoursesByStudent(Number(studentId));

  return (
    <div className="px-6 w-full min-h-screen mb-10">
      <h1 className="text-4xl font-bold text-gray-800 my-4">My Courses</h1>
      {courses && courses.length >= 1 ? (
        <div className="flex flex-col flex-wrap gap-4 justify-center sm:justify-between w-full">
          {courses?.map((course) => (
            <CourseCard key={course.id} course={course} studentId={studentId} />
          ))}
          <Link
            className="self-end max-sm:self-center max-sm:w-full"
            href={`/student/my-courses`}
          >
            <button className="px-10 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition cursor-pointer max-sm:w-full">
              Show All
            </button>
          </Link>
        </div>
      ) : (
        <h2 className="w-full mt-3 text-2xl font-semibold text-gray-700 mb-2">
          There are no courses to show
        </h2>
      )}

      <hr className="border-t border-gray-300 my-4" />
      <h1 className="text-4xl font-bold text-gray-800 my-4">
        Soon Lesson For Each Course
      </h1>
      <div className="flex flex-col lg:flex-row gap-10 items-center">
        <SoonLessonsTable studentId={studentId} />
        <div className="w-full max-w-sm min-w-[250px] px-4 py-20 bg-white shadow-lg rounded-2xl border border-gray-200 flex flex-col justify-center items-center gap-5">
          {totalCourses && totalCourses.length >= 1 ? (
            <>
              <h3 className="text-lg font-semibold">
                You are registered for {totalCourses?.length} courses
              </h3>
              <Link href={`/student/my-courses`}>
                <button className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition cursor-pointer w-full sm:w-auto">
                  Show All Courses
                </button>
              </Link>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold">
                You are not register in any course
              </h3>
              <Link href={`/student/coming-soon-courses`}>
                <button className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition cursor-pointer w-full sm:w-auto">
                  Show available courses to register
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
