import React from "react";
import Image from "next/image";
interface Props {
  name: string;
  id: number;
  status: string;
  avatar: string;
}

const StudentInfoCard = ({ name, id, status, avatar }: Props) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Image
          src={avatar || "/img/signup-background.svg"}
          alt={name}
          width={44}
          height={44}
          className=" rounded-full"
        />
        <div>
          <h1 className="text-xl text-orange-400 font-bold">{name}</h1>
          <p className="text-sm text-[#FFA41F]">Student ID: {id}</p>
        </div>
      </div>
      <div className="bg-[#FFA41F]/10 text-[#FFA41F] px-3 py-1 rounded-full text-sm font-medium">
        {status}
      </div>
    </div>
  );
};

export default StudentInfoCard;
