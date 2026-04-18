"use client";
import { CheckCircle, XCircle } from "phosphor-react";

import { Status } from "@/types";
import PersonCard from "../PersonCard/PersonCard";
import ApproveJoiningModal from "../modals/ApproveJoiningModal/ApproveJoiningModal";
import RejectJoiningModal from "../modals/RejectJoiningModal/RejectJoiningModal";
import SelectCourse from "../Dropdowns/SelectCourse";
import Loader from "../Shared/Loader";
import useStudentRequests from "@/hooks/useStudentRequests";
import TempPagination from "../Pagination/TempPagination";
interface IProps {
  monitorCoursesList: { courseId: number; courseName: string }[] | null;
}
export default function StudentRequestsTable({ monitorCoursesList }: IProps) {
  const {
    courseId,
    joiningOrders,
    currentPage,
    isApproveModalOpen,
    isRejectModalOpen,
    selectedOrder,
    isLoading,
    handleOpenRejectModal,
    handleOpenApproveModal,
    handleCloseRejectModal,
    handleCloseApproveModal,
    handleApprove,
    handleReject,
    handlePreviousPage,
    onPageChange,
    handleNextPage,
    totalPages,
  } = useStudentRequests();

  if (isLoading) {
    return <Loader message="Loading data..." />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="my-5">
        <SelectCourse
          options={monitorCoursesList}
          value={courseId}
          appendSearchParams={true}
        />
      </div>
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="h-[400px] overflow-x-auto border border-gray-200">
          {joiningOrders.length > 0 ? (
            <table className="w-full text-sm text-left text-gray-800">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 items-center">
                <tr>
                  <th className="px-6 py-3"></th>
                  <th className="px-6 py-3">Course</th>
                  <th className="px-6 py-3">Interview Status</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {joiningOrders.map((joiningOrder) => (
                  <tr
                    className="bg-white hover:bg-gray-50 h-full border-b border-gray-100"
                    key={joiningOrder.id}
                  >
                    <td>
                      <PersonCard
                        email={joiningOrder.email ?? ""}
                        imageURL={joiningOrder.image ?? "/img/signup-background.svg"}
                        name={
                          joiningOrder.firstName + " " + joiningOrder.lastName
                        }
                      />
                    </td>
                    <td className="px-6 py-1.5 text-xs">
                      {joiningOrder.courseName}
                    </td>
                    <td className="px-6 py-1.5 text-xs">
                      {joiningOrder.interviewStatus}
                    </td>

                    <td className="px-6 py-1.5">
                      <div className="flex gap-1 items-center">
                        {joiningOrder.joiningStatus === Status.ACCEPTED ? (
                          <div className="flex items-center bg-[#a4e6c7] text-gray-800 rounded-2xl px-2 py-1">
                            <CheckCircle
                              size={14}
                              weight="bold"
                              className="mr-1 text-emerald-600"
                            />
                            <span className="text-xs">Approve</span>
                          </div>
                        ) : joiningOrder.joiningStatus === Status.REJECTED ? (
                          <div className="flex items-center bg-[#ffc9c5] text-gray-800 rounded-2xl px-2 py-1">
                            <XCircle
                              size={14}
                              weight="bold"
                              className="mr-1 text-red-500"
                            />
                            <span className="text-xs">Rejected</span>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                handleOpenRejectModal(joiningOrder)
                              }
                              className="text-red-500 hover:text-red-800 cursor-pointer"
                            >
                              <XCircle size={28} className="rounded-2xl" />
                            </button>
                            <button
                              onClick={() =>
                                handleOpenApproveModal(joiningOrder)
                              }
                              className="flex items-center bg-gray-800 text-white rounded-md px-2 py-1 hover:bg-gray-700 cursor-pointer"
                            >
                              <CheckCircle
                                size={14}
                                weight="bold"
                                className="mr-1"
                              />
                              <span className="text-xs">Approve</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4 border-none text-center">No data to view</div>
          )}
        </div>
      </div>

      <div className="mt-9">
        <TempPagination
          currentPage={currentPage}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
          onPageChange={onPageChange}
          totalPages={totalPages}
        />
      </div>

      {selectedOrder && (
        <ApproveJoiningModal
          isOpen={isApproveModalOpen}
          onClose={handleCloseApproveModal}
          order={selectedOrder}
          onApprove={() =>
            handleApprove(
              selectedOrder.id,
              selectedOrder.courseId ?? -1,
              selectedOrder.studentId ?? -1
            )
          }
        />
      )}

      {selectedOrder && (
        <RejectJoiningModal
          isOpen={isRejectModalOpen}
          onClose={handleCloseRejectModal}
          order={selectedOrder}
          onApprove={() => handleReject(selectedOrder.id)}
        />
      )}
    </div>
  );
}
