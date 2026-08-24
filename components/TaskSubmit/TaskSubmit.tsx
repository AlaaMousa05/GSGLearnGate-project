"use client";

import { getAttachmentPathsByTaskId } from "@/src/db/queries/select";
import { StudentSubmission } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface IProps {
  taskId: string;
  courseId: string;
  studentId: number;
  deadline: Date;
}
const TaskSubmit = (props: IProps) => {
  const [showPopup, setShowPopup] = useState<string | null>(null);
  const [submissionType, setSubmissionType] = useState("");
  const [path, setPath] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [displayPath, setDisplayPath] = useState<string>("");
  const [attachment, setAttachment] = useState<StudentSubmission[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAttachment = async () => {
      const studentAttachment = await getAttachmentPathsByTaskId(
        Number(props.taskId),
        Number(props.courseId)
      );
      setAttachment(studentAttachment);
      setLoading(false);
    };
    getAttachment();
  }, [props.courseId, props.taskId]);

  const handleSubmissionType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubmissionType(e.target.value);
    setShowPopup(e.target.value);
    setDisplayPath("");
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let finalPath = path;
      if (submissionType === "file") {
        if (!file) {
          toast.warning("Please choose a file to upload.", { autoClose: 3000 });
          return;
        }
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/student/uploadAttachment", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("File upload failed");

        const uploadData = await uploadRes.json();
        finalPath = uploadData.url;
      }
      if (submissionType === "link") {
        if (!path) {
          toast.warning("Please Paste a link", { autoClose: 3000 });
          return;
        }
      }

      const response = await fetch("/api/student/submitAttachment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: props.taskId,
          studentId: props.studentId,
          courseId: props.courseId,
          submissionType,
          path: finalPath,
        }),
      });

      if (!response.ok) throw new Error("Failed");
      const insertedData = await response.json();
      const newPath = insertedData.insertedAttachment.path;
      const feedback = insertedData.insertedSubmission.feedback;
      setAttachment((prev) => [...(prev || []), { path: newPath, feedback }]);
      toast.success("Attachment Added Successfully", { autoClose: 3000 });
    } catch {
      toast.error("Something went wrong!! Please try again...", {
        autoClose: 3000,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0] || null);
      setDisplayPath(e.target.files[0].name);
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPath(e.target.value);
    setDisplayPath(e.target.value);
  };

  return (
    <>
      {loading ? (
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Loading...
          </h2>
        </section>
      ) : new Date(props.deadline) < new Date() && !attachment![0]?.path ? (
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Task Time Expired
          </h2>
        </section>
      ) : attachment &&
        attachment.length >= 1 &&
        attachment![0].path.startsWith("/uploads") ? (
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Your Submitted Attachment:{" "}
            <a
              href={attachment![0].path}
              download
              className="text-blue-600 underline hover:text-blue-800"
              target="_blank"
            >
              Download Submitted File
            </a>
          </h2>
          {attachment![0]?.feedback && (
            <h2 className="text-xl font-semibold text-primary mb-4">
              Co-Monitor Feedback:{" "}
              <span className="text-secondary">{attachment![0].feedback}</span>
            </h2>
          )}
        </section>
      ) : attachment &&
        attachment.length >= 1 &&
        !attachment![0].path.startsWith("/uploads") ? (
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Your Submitted Attachment:{" "}
            <a
              href={attachment![0].path}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Open Submitted Link
            </a>
          </h2>
          {attachment![0].feedback && (
            <h2 className="text-xl font-semibold text-primary mb-4">
              Co-Monitor Feedback:{" "}
              <span className="text-secondary">{attachment![0].feedback}</span>
            </h2>
          )}
        </section>
      ) : (
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Submit Your Work
          </h2>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="submissionType"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Choose Submission Type:
              </label>
              <select
                id="submissionType"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                value={submissionType}
                onChange={handleSubmissionType}
              >
                <option value="" disabled hidden>
                  Select type...
                </option>
                <option value="link">Link</option>
                <option value="file">File</option>
              </select>
            </div>

            {showPopup === "link" && (
              <div
                className="fixed inset-0 flex items-center justify-center"
                style={{ backgroundColor: "rgba(233, 147, 117, 0.3)" }}
              >
                <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
                  <h3 className="text-lg font-semibold text-neutral-700 mb-4">
                    Enter the Link
                  </h3>
                  <input
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="Paste your link here..."
                    onChange={handleLinkChange}
                  ></input>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="px-6 py-2 bg-gray-300 text-black rounded-lg font-semibold hover:bg-gray-400 transition"
                      onClick={() => setShowPopup(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition"
                      onClick={() => setShowPopup(null)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showPopup === "file" && (
              <div
                className="fixed inset-0 flex items-center justify-center"
                style={{ backgroundColor: "rgba(233, 147, 117, 0.3)" }}
              >
                <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
                  <h3 className="text-lg font-semibold text-neutral-700 mb-4">
                    Upload Your File
                  </h3>
                  <input
                    type="file"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    onChange={handleFileChange}
                    name="file"
                  />
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="px-6 py-2 bg-gray-300 text-black rounded-lg font-semibold hover:bg-gray-400 transition"
                      onClick={() => setShowPopup(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition"
                      onClick={() => setShowPopup(null)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
            {displayPath && (
              <div className="mt-4">
                <p className="text-sm text-neutral-700">
                  Selected: {displayPath}
                </p>
              </div>
            )}
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 py-3 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary-hover transition"
              >
                Submit
              </button>
            </div>
          </form>
        </section>
      )}
    </>
  );
};

export default TaskSubmit;
