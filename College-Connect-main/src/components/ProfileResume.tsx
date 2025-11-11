import {  useEffect, useState } from "react";
import { ProfileForm } from "../pages/Profile";
import toast from "react-hot-toast";

interface ProfileResumeProps {
  form: ProfileForm;
  setForm: React.Dispatch<React.SetStateAction<ProfileForm>>;
  isEditing: boolean;
}

const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5MB

const ProfileResume = ({ form, setForm, isEditing }: ProfileResumeProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>(form.resumeUrl || "");
  
  useEffect(() => {
    // If resumeFile changes, generate object URL for preview
    if (form.resumeFile) {
      const url = URL.createObjectURL(form.resumeFile);
      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url); // Clean up
      };
    } else {
      setPreviewUrl(form.resumeUrl || "");
    }
  }, [form.resumeFile, form.resumeUrl]);

  const handleResumeChange = (file: File | null) => {
    if (!file) return;
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) return toast.error("Resume must be PDF or DOC/DOCX.");
    if (file.size > MAX_RESUME_SIZE) return toast.error("Resume size must be < 5MB.");

    setForm((prev) => ({ ...prev, resumeFile: file }));
  };

  const handleResumeDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleResumeChange(file);
  };

  return (
    <div
      className="bg-white rounded-xl shadow p-6"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleResumeDrop}
    >
      <label className="font-semibold block mb-2">Resume</label>

      {isEditing ? (
        <>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleResumeChange(e.target.files?.[0] || null)}
            className="border rounded px-2 py-1 w-full"
            title="Upload your resume (PDF, DOC, DOCX)"
            placeholder="Upload your resume"
          />
          {previewUrl && (
            <iframe
              title="Resume Preview"
              src={previewUrl}
              className="w-full h-48 mt-2 border rounded"
            />
          )}
        </>
      ) : (
        <p className="text-gray-600">
          {previewUrl ? (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline"
            >
              View Resume
            </a>
          ) : (
            "Not uploaded"
          )}
        </p>
      )}
    </div>
  );
};

export default ProfileResume;
