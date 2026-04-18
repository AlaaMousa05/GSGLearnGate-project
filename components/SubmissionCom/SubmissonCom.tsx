"use client";

import TaskHeader from "./TaskHeader";
import { FolderPlus } from "@phosphor-icons/react";

import { insertCommentByCoMentor } from "@/controllers/actions/addPraivetCommrnt";
import { useEffect, useState } from "react";
import StudentInfoCard from "./StudentInfoCard";
import Image from "next/image";
import Attachments from "../Attachments/Attachments";
import { useViewSubmission } from "@/hooks/useViewSubmission";
import { usePrivateComments } from "@/hooks/usePrivateComments";
import Loader from "../Shared/Loader";
import {
  fetchCommentsBySubmissionId,
  saveSubmissionData,
} from "@/services/co-mentor-func";
import { useRouter } from "next/navigation";

interface SubmissionIdProps {
  id: number;
  CoMentorId: number;
}

const SubmissonCom = ({ id, CoMentorId }: SubmissionIdProps) => {
  const { submission, attachments, loading, error } = useViewSubmission(id);
  const {
    privateComments,
    loading: commentsLoading,
    error: commentsError,
    setPrivateComments,
  } = usePrivateComments(id, CoMentorId);
  const router = useRouter();
  const [grade, setGrade] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (submission) {
      setGrade(submission.grade?.toString() || "");
      setFeedback(submission.feedback || "");
    }
  }, [submission]);

  const handleSaveAllChanges = async () => {
    if (grade && feedback) {
      setIsSaving(true);

      try {
        const result = await saveSubmissionData({
          submissionId: id,
          grade: Number(grade),
          feedback,
        });

        if (result.success) {
          alert("All changes have been saved successfully!");
        } else {
          alert(result.message || "Failed to save changes. Please try again.");
        }
      } catch {
        alert("Failed to save changes. Please try again.");
      } finally {
        setIsSaving(false);
      }
    } else {
      alert("Please fill in all required fields before saving.");
    }
  };

  const handleAddComment = async () => {
    if (!replyText.trim()) {
      alert("Please enter a comment before submitting.");
      return;
    }

    setIsLoading(true);

    try {
      await insertCommentByCoMentor({
        submissionId: id,
        coMentorId: CoMentorId,
        text: replyText,
      });

      const updatedComments = await fetchCommentsBySubmissionId(id, CoMentorId);

      setPrivateComments(updatedComments);

      setReplyText("");
    } catch {
      alert("Failed to add comment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || commentsLoading) return <Loader message="Loading data..." />;
  if (error || commentsError) return <p>{error || commentsError}</p>;

  return (
    <div className="min-h-screen py-4">
      <div className="container mx-auto px-4 max-w-7xl">
        <StudentInfoCard
          id={submission?.studentId || 0}
          name={submission?.StudentName || "Unknown"}
          avatar={submission?.StudentImage || "/img/signup-background.svg"}
          status={submission?.status || "Submitted"}
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveAllChanges();
          }}
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <TaskHeader
              title={submission?.TaskTitle || "No Title"}
              points={submission?.points || 0}
              submittedAt={submission?.createdAt}
            />

            <div className="p-5 space-y-6">
              <section>
                <h3 className="text-lg text-[#FFA41F] font-semibold  mb-3 pb-2 border-b">
                  Student Submission
                </h3>
                <Attachments paths={[attachments.attachmentPath]} />
              </section>

              <section className="pt-2">
                <h3 className="text-lg text-[#FFA41F] font-medium mb-3 pb-2 border-b">
                  Grading
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label
                      htmlFor="feedback"
                      className="block mb-2 font-medium text-[#FFA41F]"
                    >
                      Feedback
                    </label>
                    <textarea
                      id="feedback"
                      rows={4}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Enter your feedback here..."
                      className="w-full p-3 border text-[#FFA41F] rounded-md focus:outline-none focus:ring-1 focus:ring-[#FFA41F] focus:border-[#FFA41F]"
                    ></textarea>
                  </div>

                  <div>
                    <label
                      htmlFor="grade"
                      className="block text-[#FFA41F] mb-2 font-medium"
                    >
                      {`Grade (0-${submission?.points || 0})`}
                    </label>
                    <input
                      id="grade"
                      type="number"
                      min="0"
                      max={submission?.points || 0}
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="Enter grade"
                      className="w-full p-3 text-[#FFA41F] border rounded-md focus:outline-none focus:ring-1 focus:ring-[#FFA41F] focus:border-[#FFA41F] text-lg"
                      required
                    />
                  </div>
                </div>
              </section>

              <section className="pt-2">
                <h3 className="text-lg text-[#FFA41F] font-medium mb-3 pb-2 border-b flex items-center gap-2">
                  Comments
                  <span className="ml-1 bg-[#FFA41F] text-white rounded-full px-2 py-0.5 text-xs">
                    {privateComments.length}
                  </span>
                </h3>

                <div
                  className="space-y-3 divide-y divide-orange-100 max-h-96 overflow-y-auto pr-2"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#FFA41F #F8FAFC",
                  }}
                >
                  {privateComments.map((comment) => (
                    <div
                      key={comment.commentId}
                      className="border p-2 rounded-md text-orange-800 bg-orange-50"
                    >
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Image
                            src={comment.image || "/img/signup-background.svg"}
                            alt={comment.createdBy || "User"}
                            width={28}
                            height={28}
                            className="rounded-full"
                          />
                          <span className="font-medium">
                            {comment.createdBy || "Unknown User"}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p>{comment.commentText}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-2">
                  <textarea
                    placeholder="Add a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm  text-orange-800 focus:outline-none focus:ring-1 focus:ring-[#FFA41F] focus:border-[#FFA41F]"
                  ></textarea>
                  <button
                    type="button"
                    onClick={handleAddComment}
                    disabled={isLoading}
                    className={`mt-1 px-3 py-1 rounded-md text-sm text-white ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#FFA41F] hover:bg-[#FF9800]"
                    }`}
                  >
                    {isLoading ? "Loading..." : "Reply"}
                  </button>
                </div>
              </section>
            </div>

            <div className="bg-gray-50 p-4 border-t border-amber-700 flex justify-between items-center">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border rounded-md hover:bg-gray-100  text-orange-800 "
              >
                Back to List
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className={`px-4 py-2 rounded-md text-white flex items-center gap-2 ${
                  isSaving ? "bg-gray-400" : "bg-[#FFA41F] hover:bg-[#FF9800]"
                }`}
              >
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <FolderPlus size={30} />
                    Save All Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissonCom;
