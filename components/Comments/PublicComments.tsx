"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchPublicCommentsByTaskId } from "@/services/co-mentor-func";
import { PublicComment, Role } from "@/types";
import Loader from "../Shared/Loader";
import { insertPublicComment } from "@/controllers/actions/addPublicCommrnt";
import { useAuth } from "@/context/user";

interface Props {
  taskId: number;
  roles: string;
}

const PublicComments = ({ taskId, roles }: Props) => {
  const { user } = useAuth();

  const [publicComments, setPublicComments] = useState<PublicComment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [createById, setCreateById] = useState<number>(0);

  useEffect(() => {
    if (roles === Role.MONITOR || roles === Role.CO_MONITOR) {
      setCreateById(user.userId ?? -1);
    } else {
      setCreateById(user.userId ?? -1);
    }
  }, [roles, user.userId]);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const comments = await fetchPublicCommentsByTaskId(taskId);
        setPublicComments(comments);
      } catch {
        setError("Failed to load public comments.");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [taskId]);
  const handleAddComment = async () => {
    if (!replyText.trim()) {
      alert("Please enter a comment before submitting.");
      return;
    }

    setIsSaving(true);

    try {
      await insertPublicComment({
        TaskId: taskId,
        createById: createById,
        text: replyText,
        role: roles,
      });

      const updatedComments = await fetchPublicCommentsByTaskId(taskId);

      setPublicComments(updatedComments);

      setReplyText("");
    } catch {
      alert("Failed to add comment. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <Loader />;

  if (error)
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md my-4">{error}</div>
    );
  let message = false;
  if (publicComments.length === 0) {
    message = true;
  }

  const getUserBadgeColor = (userType?: string) => {
    switch (userType) {
      case "Student":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Co-Mentor":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Mentor":
        return "bg-orange-200 text-orange-800 border-orange-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-2 bg-white rounded-xl p-2 w-[97%] items-center m-auto border border-orange-100 mb-5">
      <h3 className="text-xl font-bold text-[#FFA41F] mb-6 border-r-4 border-[#FFA41F] pr-3">
        Public Comments ({publicComments.length})
      </h3>
      {message && (
        <div className="text-center py-8 text-gray-500">No comments yet</div>
      )}
      <div
        className="divide-y divide-orange-100 max-h-96 overflow-y-auto pr-2"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#FFA41F #F8FAFC" }}
      >
        {publicComments.map((comment) => (
          <div
            key={comment.commentId}
            className="py-4 hover:bg-orange-50 transition-colors rounded-lg px-3"
          >
            <div className="flex justify-between items-start ">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden  border-orange-300">
                  <Image
                    src={comment.userImage || "/img/signup-background.svg"}
                    alt={comment.userName || "User"}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {comment.userName || "Unknown User"}
                    </span>
                    {comment.userType && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${getUserBadgeColor(
                          comment.userType
                        )}`}
                      >
                        {comment.userType}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {comment.userEmail}
                  </span>
                </div>
              </div>

              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full whitespace-nowrap">
                {new Date(comment.createdAt).toLocaleString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="pr-12 mt-2">
              <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                {comment.commentText}
              </p>
            </div>
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
          disabled={isSaving}
          className={`mt-1 px-3 py-1 rounded-md text-sm text-white ${
            isSaving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#FFA41F] hover:bg-[#FF9800]"
          }`}
        >
          {isSaving ? "Loading..." : "Reply"}
        </button>
      </div>
    </div>
  );
};

export default PublicComments;
