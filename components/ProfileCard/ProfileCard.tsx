"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Envelope, Calendar, MapPin, Cake, Spinner } from "phosphor-react";
import { fetchCoMonitorUserDetails } from "@/services/co-mentor-func";

interface CoMonitor {
  name: string;
  email: string;
  joinDate: string;
  image: string;
  city: string;
  dateOfBirth: string;
}

const ProfileCard = ({ coMonitorId }: { coMonitorId: number }) => {
  const [coMonitor, setCoMonitor] = useState<CoMonitor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoMonitorDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const userDetails = await fetchCoMonitorUserDetails(coMonitorId);
        if (userDetails) {
          setCoMonitor({
            name: `${userDetails.firstName} ${userDetails.lastName}`,
            email: userDetails.email,
            joinDate: userDetails.createdAt
              ? new Date(userDetails.createdAt).toLocaleDateString()
              : "N/A",
            image: "/img/signup-background.svg",
            city: userDetails.city || "N/A",
            dateOfBirth: userDetails.dateOfBirth
              ? new Date(userDetails.dateOfBirth).toLocaleDateString()
              : "N/A",
          });
        } else {
          setError("Co-Monitor not found.");
        }
      } catch {
        setError("Failed to load Co-Monitor details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoMonitorDetails();
  }, [coMonitorId]);

  return (
    <div className=" p-6 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center gap-4">
      {loading ? (
        <div className="text-center text-gray-500 flex flex-col items-center">
          <Spinner
            className="animate-spin text-[#FFA41F]"
            size={32}
            weight="bold"
          />
          <span>Loading...</span>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <>
          <div className="w-24 h-24 rounded-full overflow-hidden relative">
            <Image
              src={coMonitor?.image || "/img/signup-background.svg"}
              alt={coMonitor?.name || "Co-Monitor"}
              fill
              sizes="96px"
              className="rounded-full object-cover"
            />
          </div>

          <h4 className="text-lg font-bold text-[#FFA41F] text-center">
            {coMonitor?.name}
          </h4>

          <div className="space-y-3 w-full">
            <div className="flex items-center gap-2">
              <Envelope size={20} className="text-[#FFA41F]" />
              <span className="text-sm text-gray-700">{coMonitor?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-[#FFA41F]" />
              <span className="text-sm text-gray-700">{coMonitor?.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Cake size={20} className="text-[#FFA41F]" />
              <span className="text-sm text-gray-700">
                DOB: {coMonitor?.dateOfBirth}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-[#FFA41F]" />
              <span className="text-sm text-gray-700">
                Joined: {coMonitor?.joinDate}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileCard;
