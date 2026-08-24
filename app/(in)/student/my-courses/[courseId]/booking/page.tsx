import SelectStudentAppointmentTime from "@/components/SelectStudentAppointmentTime/SelectStudentAppointmentTime";
import { requireAuth } from "@/context/auth";
import { getCoMonitorByCourseId } from "@/src/db/queries/select";
import Link from "next/link";

interface IProps {
  params: Promise<{ courseId: string }>;
}
const BookingPage = async (props: IProps) => {
  const { courseId } = await props.params;
  const data = await requireAuth();
  const studentId = data.userId;
  const coMonitor = await getCoMonitorByCourseId(Number(courseId));
  return (
    <div className="w-full max-w-lg mx-auto bg-white shadow-lg rounded-2xl border border-gray-200 p-6 flex flex-col gap-4 mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Book an Appointment
      </h2>

      <div className="flex flex-col gap-3">
        <label className="text-gray-700">Co-Monitor</label>
        <input
          type="text"
          className="p-2 border rounded-lg text-gray-700"
          value={coMonitor![0].coMonitorName}
          disabled
          placeholder="Select a teacher"
        />
      </div>

      <SelectStudentAppointmentTime
        coMonitorId={coMonitor![0].coMonitorId}
        studentId={studentId}
      />

      <Link
        href={`/student/appointments`}
        className="text-center text-primary hover:underline mt-4"
      >
        View My Appointments
      </Link>
    </div>
  );
};

export default BookingPage;
