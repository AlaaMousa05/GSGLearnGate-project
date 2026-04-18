"use client";

import { Comments, StudentName } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface IProps {
  comments: Comments[] | null;
  studentId: number;
  courseId: string;
  taskId: string;
  studentName: StudentName[];
  submissionId: number | null;
}
const StudentPrivateComments = (props: IProps) => {
  const [content, setContent] = useState("");
  const [comments, setComments] = useState<Comments[] | null>(props.comments);
  const [submissionId, setSubmissionId] = useState<number | null>(null);

  const fetchSubmission = useCallback(async () => {
    try {
      const res = await fetch("/api/student/getSubmission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: props.courseId,
          taskId: props.taskId,
        }),
      });

      if (!res.ok) {
        console.error("No submission found");
        return;
      }

      const data = await res.json();
      if (data === null || data.id === null) {
        setSubmissionId(null);
      } else {
        const number = Number(data.id);
        setSubmissionId(number);
      }
    } catch (error) {
      console.error("Error fetching submission:", error);
    }
  }, [props.courseId, props.taskId]);

  useEffect(() => {
    fetchSubmission();
  }, [fetchSubmission]);

  const handleClick = async () => {
    if (content !== "" && submissionId !== null) {
      try {
        const response = await fetch("/api/student/insertComment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: content,
            studentId: Number(props.studentId),
            taskId: Number(props.taskId),
            courseId: Number(props.courseId),
            isPublic: false,
            submissionId: props.submissionId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit comment");
        }
        const newComment = await response.json();
        setComments((prev) => [...(prev || []), newComment]);
        setContent("");
        fetchSubmission();
        toast.success("Comment Added Successfully", { autoClose: 3000 });
      } catch (error) {
        console.error("Insert Comment failed:", error);
        toast.error("Comment Added Successfully", { autoClose: 3000 });
      }
    } else {
      toast.warning("Add Submission and Content then post comment", {
        autoClose: 3000,
      });
    }
  };

  return submissionId ? (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-[#FFA41F] mb-4">
        Private Comments
      </h2>
      <div className="space-y-4">
        {comments &&
          comments
            .filter(
              (comment) =>
                !comment.isPublic &&
                (props.submissionId == null ||
                  comment.submissionId === props.submissionId)
            )
            .map((comment) => {
              return (
                <div
                  key={comment.id}
                  className="bg-[#FFF5E8] p-4 rounded-lg shadow mb-5"
                >
                  <p className="text-sm text-neutral-700">
                    <span className="font-medium text-[#E99375]">
                      {comment.userName || props.studentName[0].name}:
                    </span>{" "}
                    {comment.content}
                  </p>
                  <p className="text-xs text-neutral-700">
                    {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              );
            })}
      </div>
      <textarea
        className="w-full p-4 border border-[#FFA41F] rounded-lg focus:ring-2 focus:ring-[#E99375] focus:outline-none"
        rows={4}
        placeholder="Write a private comment to your instructor..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <div className="flex justify-center mt-4">
        <button
          type="button"
          className="px-6 py-3 bg-[#FFA41F] text-white rounded-lg font-semibold shadow hover:bg-[#FF8700] transition"
          onClick={handleClick}
        >
          Post Comment
        </button>
      </div>
    </section>
  ) : (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-[#FFA41F] mb-4">
        Private Comments only after submit
      </h2>
    </section>
  );
};

export default StudentPrivateComments;
