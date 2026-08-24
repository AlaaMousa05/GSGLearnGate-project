"use client";
import { CoMonitorAppointment } from "@/types/appointments";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface IProps {
  coMonitorId: number;
  studentId: number;
}
const SelectStudentAppointmentTime = (props: IProps) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<CoMonitorAppointment>();
  const [availability, setAvailability] = useState<CoMonitorAppointment[]>();
  const [time, setTime] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          `/api/student/coMonitorAvailability?id=${props.coMonitorId}`
        );
        const data = await res.json();
        setAvailability(data);
      } catch (err) {
        console.error("Failed to fetch:", err);
      }
    };
    fetchAppointments();
  }, [props.coMonitorId]);

  const handleBooking = async () => {
    try {
      const response = await fetch("/api/student/bookingAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: selectedRecord!.id,
          studentId: Number(props.studentId),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to book appointment");
      }
      toast.success("Appointment booked successfully!", { autoClose: 3000 });
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error("Failed to book appointment", { autoClose: 3000 });
    }
    setSelectedDate("");
    setTime("");
  };
  const handleDateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const newSelectedRecord = availability?.find((appointment) => {
      return (
        new Date(appointment.date).toLocaleDateString("en-GB") === selectedValue
      );
    });
    setSelectedDate(selectedValue);
    setSelectedRecord(newSelectedRecord);
    setTime(newSelectedRecord!.startTime);
  };
  return (
    <>
      <div className="flex flex-col gap-3">
        <label className="text-gray-700">Select Date</label>
        <select
          className="p-2 border rounded-lg text-gray-700"
          value={selectedDate}
          onChange={handleDateSelect}
        >
          <option value="" disabled>
            Select a time
          </option>
          {availability &&
            availability
              ?.filter((appointment) => {
                return appointment.isBooked === false;
              })
              .map((appointment) => (
                <option
                  key={appointment.id}
                  value={new Date(appointment.date).toLocaleDateString("en-GB")}
                >
                  {new Date(appointment.date).toLocaleDateString("en-GB")}
                </option>
              ))}
        </select>
      </div>
      <div className="flex flex-col gap-3">
        <label className="text-gray-700">Time</label>
        <input
          type="text"
          className="p-2 border rounded-lg text-gray-700"
          value={time ? time : "No Time"}
          disabled
        />
      </div>
      <button
        onClick={handleBooking}
        className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition cursor-pointer flex justify-center"
        disabled={!selectedDate}
      >
        Confirm Booking
      </button>
    </>
  );
};

export default SelectStudentAppointmentTime;
