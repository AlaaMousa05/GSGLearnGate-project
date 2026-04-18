import { CourseWithPresenter } from "@/types";
import { CalendarDots } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { AlignLeft, User } from "phosphor-react";
import React from "react";
interface IProps {
  course: CourseWithPresenter;
}
const Hero = ({ course }: IProps) => {
  return (
    <div className="relative w-full h-[500] ">
      <Image
        src="/img/signup-background.svg"
        fill
        alt="course image"
        style={{ objectFit: "cover" }}
      />
      <div className="absolute inset-0 bg-[rgba(0,0,0,.7)]"></div>

      <div className="absolute z-30 md:w-[750] lg:w-[970] xl:w-[1170] left-1/2 -translate-x-1/2 bottom-16 text-white flex justify-between items-end  max-lg:flex-col max-lg:items-start max-md:w-[95%] max-lg:gap-5">
        <div className="flex-3">
          <p className="text-3xl font-bold mb-8">{course.title}</p>
          <p className="mb-8 max-lg:w-[90%]">{course.description}</p>
          <div className="flex items-center gap-11 max-lg:w-[90%] max-sm:flex-col max-sm:gap-1 max-sm:items-start">
            <p className="flex gap-2 items-center">
              <User size={16} /> Instructor: {course.presenterName}
            </p>
            <p className="flex gap-2 items-center">
              <AlignLeft size={16} /> Difficult: {course.difficulty}
            </p>
            <p className="flex gap-2 items-center">
              <CalendarDots size={16} />
              Duration: {course.duration}
            </p>
          </div>
        </div>
        <div className="flex-1 text-center p-4 bg-[var(--vital-color)] text-black rounded-md max-lg:w-full">
          <p className="mb-4 text-lg">Seats are limited</p>
          <hr />
          <button className="mt-4 text-lg border-1 border-gray-400 w-full rounded-md py-1.5 bg-[#7777774f] cursor-pointer hover:shadow-md duration-7">
            <Link href="/login">Enroll now</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
