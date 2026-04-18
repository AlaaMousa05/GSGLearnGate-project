"use client";
import {
  CourseState,
  submitCourse,
} from "@/controllers/actions/updateCourseAction";
import { getCourse } from "@/services/courses";
import { Difficulty, UsersNames } from "@/types";
import { Image as ImageIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useActionState, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface IProps {
  monitors: UsersNames[];
  coMonitors: UsersNames[];
}

const UpdateCourseForm = ({ monitors, coMonitors }: IProps) => {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    image:"",
    title: "",
    description: "",
    duration: "",
    monitorId: "",
    adminId: "",
    coMonitorId: "",
    difficulty: "",
    details: "",
    entryRequirements: "",
    applyStartDate: "",
    applyEndDate: "",
    courseStartDate: "",
    courseEndDate: "",
  });

  const { id } = useParams();
  const initialState: CourseState = {
    success: false,
    error: "",
    message: "",
  };

  const [formState, formAction, isPending] = useActionState(
    submitCourse,
    initialState
  );

  useEffect(() => {
    const fetchCourse = async () => {
      if (id) {
        const data = await getCourse(Number(id));
        if (data) {
          setFormData({
            image:data.image || "",
            title: data.title || "",
            description: data.description || "",
            duration: data.duration.toString() || "",
            monitorId: data.monitorId?.toString() || "",
            coMonitorId: data.coMonitorId?.toString() || "",
            adminId: data.adminId?.toString() || "",
            difficulty: data.difficulty || "",
            details: data.details || "",
            entryRequirements: data.entryRequirements || "",
            applyStartDate: data.applyStartDate
              ? new Date(data.applyStartDate).toISOString().split("T")[0]
              : "",
            applyEndDate: data.applyEndDate
              ? new Date(data.applyEndDate).toISOString().split("T")[0]
              : "",
            courseStartDate: data.courseStartDate
              ? new Date(data.courseStartDate).toISOString().split("T")[0]
              : "",
            courseEndDate: data.courseEndDate
              ? new Date(data.courseEndDate).toISOString().split("T")[0]
              : "",
          });
          setSelectedImg(data.image)
        }
      }
    };
    fetchCourse();
  }, [id]);

  useEffect(() => {
    if (formState?.message) {
      if (formState.success) {
        toast.success(formState.message);
      } else {
        toast.error(formState.message);
      }
    }
  }, [formState]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImg(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="w-full mx-auto mt-4 mb-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white rounded shadow-md overflow-hidden p-5 border-1 border-gray-300">
        <h1 className="text-xl font-semibold text-[#FFA41F]">Update Course</h1>
        <form className="space-y-5" action={formAction}>
          <div className="flex flex-col items-center">
            <label
              htmlFor="image"
              className="flex justify-center items-center w-16 h-16 rounded-full cursor-pointer bg-gray-100 border-2 border-gray-300"
            >
              {selectedImg ? (
                <Image
                  src={selectedImg}
                  alt="Selected"
                  className="rounded-full object-cover"
                  width={70}
                  height={70}
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-500" />
              )}
            </label>
            <span className="text-sm text-gray-600 mt-5">Upload Course Image</span>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              className="hidden"
              defaultValue={formData.image}
              onChange={handleImageChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Course Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                placeholder="Enter course title"
                required
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700"
              >
                Duration (in hours)
              </label>
              <input
                id="duration"
                name="duration"
                type="number"
                value={formData.duration}
                placeholder="e.g., 60 hours"
                required
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="monitorId"
                className="block text-sm font-medium text-gray-700"
              >
                Monitor
              </label>
              <select
                id="monitorId"
                name="monitorId"
                value={formData.monitorId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="" disabled>
                  Select Monitor
                </option>
                {monitors.map((monitor) => (
                  <option key={monitor.id} value={Number(monitor.id)}>
                    {`${monitor.firstName} ${monitor.lastName}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="coMonitorId"
                className="block text-sm font-medium text-gray-700"
              >
                Co-Monitor
              </label>
              <select
                id="coMonitorId"
                name="coMonitorId"
                value={formData.coMonitorId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="" disabled>
                  Select Co-Monitor
                </option>
                {coMonitors.map((coMonitor) => (
                  <option key={coMonitor.id} value={Number(coMonitor.id)}>
                    {`${coMonitor.firstName} ${coMonitor.lastName}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Course Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              placeholder="Provide a brief course description"
              required
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-none"
              rows={10}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="entryRequirements"
                className="block text-sm font-medium text-gray-700"
              >
                Entry Requirements
              </label>
              <input
                id="entryRequirements"
                name="entryRequirements"
                type="text"
                value={formData.entryRequirements}
                placeholder="e.g., Basic programming knowledge"
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="details"
                className="block text-sm font-medium text-gray-700"
              >
                Additional Details
              </label>
              <input
                id="details"
                name="details"
                type="text"
                value={formData.details}
                placeholder="e.g., Online/Offline course details"
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="difficulty"
              className="block text-sm font-medium text-gray-700"
            >
              Difficulty Level
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="" disabled>
                Select difficulty level
              </option>
              <option value={Difficulty.BEGINNER}>Beginner</option>
              <option value={Difficulty.INTERMEDIATE}>Intermediate</option>
              <option value={Difficulty.ADVANCED}>Advanced</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="applyStartDate"
                className="block text-sm font-medium text-gray-700"
              >
                Apply Start Date
              </label>
              <input
                id="applyStartDate"
                name="applyStartDate"
                type="date"
                value={formData.applyStartDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="applyEndDate"
                className="block text-sm font-medium text-gray-700"
              >
                Apply End Date
              </label>
              <input
                id="applyEndDate"
                name="applyEndDate"
                type="date"
                value={formData.applyEndDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="courseStartDate"
                className="block text-sm font-medium text-gray-700"
              >
                Course Start Date
              </label>
              <input
                id="courseStartDate"
                name="courseStartDate"
                type="date"
                value={formData.courseStartDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="courseEndDate"
                className="block text-sm font-medium text-gray-700"
              >
                Course End Date
              </label>
              <input
                id="courseEndDate"
                name="courseEndDate"
                type="date"
                value={formData.courseEndDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
          <input type="hidden" name="courseId" value={id} />
          <input type="hidden" name="adminId" value={formData.adminId} />
          <input type="hidden" name="currentImage" value={formData.image} />
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-2 border-none rounded-md shadow-sm text-lg text-white bg-[#FFA41F]
              cursor-pointer hover:shadow-md hover:bg-[#ffb11f]"
            >
              {isPending ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCourseForm;