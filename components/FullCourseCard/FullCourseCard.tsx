import { StudentCourseBigCard } from "@/types";
import Link from "next/link";
import React from "react";

interface IProps {
  course: StudentCourseBigCard;
  studentId: number;
}
const FullCourseCard = (props: IProps) => {
  const today = new Date();
  const courseStartDate = new Date(props.course.startDate);
  const courseEndDate = new Date(props.course.endDate);

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

  return (
    <div className="w-full bg-white shadow-lg rounded-2xl border border-gray-200 p-4 flex flex-col gap-4">
      <h3 className="text-xl font-semibold text-gray-800">
        {props.course.title}
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-gray-700">Progress</p>
          <p className="text-gray-600">
            {completedHours}/{totalHours} hours
          </p>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <span
            className="block h-full bg-primary rounded-full"
            style={{
              width: `${Math.round((completedHours / totalHours) * 100)}%`,
            }}
          ></span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700">Status</p>
          <p className="text-gray-600 font-medium">{props.course.status}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700">Start Date</p>
          <p className="text-gray-600">
            {props.course.startDate.toLocaleDateString("en-GB")}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700">Assignments</p>
          <p className="text-gray-600">
            {props.course.completedTasks}/{props.course.totalTasks} completed
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700">Monitor</p>
          <p className="text-gray-600">{props.course.monitorName}</p>
        </div>
      </div>
      {props.course.status !== "Finished" && (
        <Link
          href={`/student/my-courses/${props.course.id}`}
          className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition cursor-pointer flex justify-center"
        >
          More Details
        </Link>
      )}
    </div>
  );
};

export default FullCourseCard;
