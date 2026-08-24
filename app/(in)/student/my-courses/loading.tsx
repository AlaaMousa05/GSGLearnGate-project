import React from "react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center w-full min-h-screen">
      <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
