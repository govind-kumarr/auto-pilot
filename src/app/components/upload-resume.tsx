"use client";
import React, { useState } from "react";
import { UploadCloud, Loader2, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

export default function UploadResume() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axios.post("/api/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => setFile(null),
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0])
      setFile(e.dataTransfer.files[0]);
  };

  const uploadFile = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);
    uploadMutation.mutate(formData);
  };

  const loading = uploadMutation.isPending;
  const uploaded = uploadMutation.isSuccess;

  return (
    <div className="min-h-screen flex items-start justify-center p-8 bg-background font-sans">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">
            Upload Your Resume
          </h2>
          <p className="text-sm text-muted mt-1">PDF (max 5 MB)</p>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-3 transition cursor-pointer
            ${
              isDragging
                ? "border-primary bg-primary-hover/20"
                : "border-border bg-card"
            }
            hover:bg-hover
          `}
        >
          <UploadCloud className="w-12 h-12 text-muted" />
          <p className="text-foreground text-sm">
            Drag & drop your resume here, or{" "}
            <label className="text-primary font-medium cursor-pointer hover:underline">
              browse
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </p>
          {file && (
            <p className="text-xs text-muted mt-2">
              Selected: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>

        {/* Upload Button */}
        {file && (
          <button
            onClick={uploadFile}
            disabled={loading}
            className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-3 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : uploaded ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <UploadCloud className="w-5 h-5" />
            )}
            {loading
              ? "Uploading..."
              : uploaded
              ? "Uploaded!"
              : "Upload Resume"}
          </button>
        )}

        {/* Error Message */}
        {uploadMutation.isError && (
          <p className="text-red-500 text-sm text-center">
            {(uploadMutation.error as any)?.message || "Upload failed"}
          </p>
        )}
      </div>
    </div>
  );
}
