"use client";
import { CourseWithPresenter } from "@/types";
import { Clock, Person } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import TempPagination from "../Pagination/TempPagination";

interface IProps {
  courses: CourseWithPresenter[];
}
const ITEMS_PER_PAGE: number = 6;
const CourseComponent = ({ courses }: IProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentCourses = courses.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <div className="flex gap-10 flex-col">
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))] gap-8 w-full">
        {currentCourses.map((course) => {
          const imageUrl =
            course.image && (course.image.startsWith("/img/") || course.image.startsWith("http"))
              ? course.image
              : "/img/signup-background.svg";
          const presenterImageUrl =
            course.presenterImage &&
            (course.presenterImage.startsWith("/img/") || course.presenterImage.startsWith("http"))
              ? course.presenterImage
              : null;
          return (
            <Link
              href={`/course-details/${course.id}`}
              key={course.id}
              className="border-1 border-gray-300 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all max-sm:w-[95%] max-sm:m-auto"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={imageUrl}
                  alt={`${course.title} cover image`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex justify-between p-2.5">
                <p className="font-bold text-[var(--primary-color)]">
                  {course.title}
                </p>
                <p className="text-[#5c7cd4]">{course.difficulty}</p>
              </div>
              <p className="p-2.5 text-[#383449] line-clamp-2">
                {course.description}
              </p>
              <div className="flex items-center gap-1.5 p-2.5 border-b-1 border-gray-300 text-sm text-[#777]">
                <Clock size={20} />
                {course.duration} hrs
              </div>
              <div className="flex items-center gap-5 p-2.5">
                <div className="w-10 h-10 overflow-hidden rounded-full flex items-center justify-center bg-gray-200">
                  {course.presenterImage ? (
                    <Image
                      src={presenterImageUrl || "/img/signup-background.svg"}
                      alt="presenterImage"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  ) : (
                    <Person size={20} className="text-gray-500" />
                  )}
                </div>
                <p className="text-[#383449]">by {course.presenterName}</p>
              </div>
            </Link>
          );
        })}
      </div>
      <TempPagination
        currentPage={currentPage}
        totalPages={totalPages}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default CourseComponent;
