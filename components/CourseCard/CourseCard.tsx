import { StudentCourseBigCard, StudentCourseSmallCard } from "@/types";
import Link from "next/link";

interface IProps {
  course: StudentCourseBigCard | StudentCourseSmallCard;
  studentId: number;
}

const CourseCard = async (props: IProps) => {
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
    <div className="w-full min-w-0 sm:max-w-md p-4 bg-white shadow-lg rounded-2xl border border-gray-200 flex-grow">
      <h3 className="text-xl font-semibold text-gray-800">
        {props.course.title}
      </h3>

      <div className="mt-3 space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-gray-700">Progress</p>
          <p className="text-gray-600">
            {completedHours}/{totalHours} hours
          </p>
        </div>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <span
            className={`block h-full bg-[#FFA41F] rounded-full`}
            style={{ width: `${completedHours / totalHours}%` }}
          ></span>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className="text-gray-700">
          Monitor:{" "}
          <span className="font-medium">{props.course.monitorName}</span>
        </p>
        <Link
          href={`/student/my-courses/${props.course.id}`}
          className="mt-3 px-4 py-2 bg-[#FFA41F] text-white rounded-lg hover:bg-[#FF8C00] transition cursor-pointer"
        >
          More Details
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
