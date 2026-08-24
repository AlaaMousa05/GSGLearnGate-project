import { StudentCourseBigCard } from "@/types";
import Link from "next/link";

interface IProps {
  course: StudentCourseBigCard;
  studentId: number;
}
const NotRegisteredCourseCard = (props: IProps) => {
  return (
    <div className="w-full bg-white shadow-lg rounded-2xl border border-gray-200 p-4 flex flex-col gap-4">
      <h3 className="text-xl font-semibold text-gray-800">
        {props.course.title}
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-gray-700">Duration</p>
          <p className="text-gray-600">{props.course.duration * 6} hours</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700">Last Date to Apply</p>
          <p className="text-gray-600 font-medium">
            {new Date(props.course.applyEndDate).toLocaleDateString("en-GB")}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700">Start Date</p>
          <p className="text-gray-600">
            {props.course.startDate.toLocaleDateString("en-GB")}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700">Monitor</p>
          <p className="text-gray-600">{props.course.monitorName}</p>
        </div>
      </div>
      <Link
        href={`/student/coming-soon-courses/${props.course.id}`}
        className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition cursor-pointer flex justify-center"
      >
        More Details
      </Link>
    </div>
  );
};

export default NotRegisteredCourseCard;
