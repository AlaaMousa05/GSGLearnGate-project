"use client";

import { AttendanceRecordStatus } from "@/types/index";
import PersonCard from "@/components/PersonCard/PersonCard";
import { useActionState, useEffect, useState } from "react";
import { updateAttendanceAction } from "@/controllers/actions/attendance";
import { useParams } from "next/navigation";
import { listStudentInCourse } from "@/services/attendance";
import { CourseStudentsList } from "@/types/attendanceOperations";
import Loader from "@/components/Shared/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/context/user";

function getStatusColor(status: AttendanceRecordStatus) {
  const colors = {
    [AttendanceRecordStatus.PRESENT]:
      "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 active:bg-green-200",
    [AttendanceRecordStatus.ABSENT]:
      "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 active:bg-red-200",
    [AttendanceRecordStatus.LATE]:
      "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 active:bg-yellow-200",
    [AttendanceRecordStatus.EXCUSED]:
      "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 active:bg-blue-200",
  };
  return colors[status];
}

export default function AttendanceEvaluationPage() {
  const { user } = useAuth();
  const params = useParams();
  const courseId = params?.slug?.[0] ? Number(params.slug[0]) : -1;
  const sessionId = params?.slug?.[1] ? Number(params.slug[1]) : -1;

  const [students, setStudents] = useState<CourseStudentsList[]>([]);
  const [loading, setLoading] = useState(true);

  const [formState, formAction] = useActionState(updateAttendanceAction, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (formState.message) {
      if (formState.success) {
        toast.success(formState.message, { autoClose: 3000 });
      } else {
        toast.error(formState.message, { autoClose: 3000 });
      }
    }
  }, [formState]);

  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true);
        const data = await listStudentInCourse(courseId);
        setStudents(data);
      } catch {
        toast.error("Failed to load student data");
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader message="Loading attendance data..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">
            Attendance Evaluation
          </h1>
          <p className="text-sm text-gray-600">
            Course ID: {courseId} | Session ID: {sessionId}
          </p>
        </div>

        <div className="max-h-[500px] overflow-y-auto">
          {students.length > 0 ? (
            <table className="w-full text-left text-gray-800">
              <thead className="sticky top-0 bg-gray-50 text-xs uppercase text-gray-700 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-medium min-w-[220px]">
                    Student
                  </th>
                  <th className="px-6 py-4 font-medium min-w-[320px]">
                    Attendance Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <PersonCard
                        email={student.email ?? ""}
                        imageURL={student.image ?? "/img/signup-background.svg"}
                        name={`${student.firstName} ${student.lastName}`}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {Object.values(AttendanceRecordStatus).map((status) => (
                          <form key={status} action={formAction}>
                            <input
                              type="hidden"
                              name="studentId"
                              value={student.id}
                            />
                            <input
                              type="hidden"
                              name="courseId"
                              value={courseId}
                            />
                            <input
                              type="hidden"
                              name="monitorId"
                              value={user.id!}
                            />
                            <input
                              type="hidden"
                              name="sessionId"
                              value={sessionId}
                            />
                            <button
                              type="submit"
                              name="status"
                              value={status}
                              className={`px-4 py-1.5 text-sm rounded-full border shadow-sm ${
                                student.status === status
                                  ? `${getStatusColor(status)} font-semibold`
                                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 active:bg-gray-100"
                              } transition-all duration-200 ease-in-out`}
                              aria-label={`Mark as ${status.toLowerCase()}`}
                            >
                              {status.charAt(0) + status.slice(1).toLowerCase()}
                            </button>
                          </form>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-10 text-center">
              <p className="text-gray-500 text-lg font-medium">
                No students enrolled in this course
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Add students to start tracking attendance.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
