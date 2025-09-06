"use client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Copy,
  Send,
  Check,
  AlertCircle,
} from "lucide-react";
import React, { useState, useEffect } from "react";

interface RoleProps {
  role: {
    _id: string;
    role: string;
    body?: string;
    subject?: string;
    hr_email?: string;
  };
}

export default function Role({ role: roleObject }: RoleProps) {
  const { _id, role, hr_email } = roleObject;

  const [expanded, setExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState<"subject" | "body" | null>(
    null
  );
  const [body, setBody] = useState(roleObject.body || "");
  const [subject, setSubject] = useState(roleObject.subject || "");
  const [error, setError] = useState<string | null>(null);

  const { isPending, mutate: writeMailMutate } = useMutation({
    mutationKey: ["write-email", _id],
    mutationFn: (data: { roleId: string }) =>
      axios.post("/api/write-mail", data),
    onSuccess: (res) => {
      const data = res.data;
      setBody(data.body || "");
      setSubject(data.subject || "");
    },
    onError: (err: any) => {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to generate email");
    },
  });

  // Automatically fetch email if missing when component mounts
  useEffect(() => {
    if (!body && !subject) {
      writeMailMutate({ roleId: _id });
    }
  }, [_id]);

  const handleExpand = () => {
    setError(null);
    setExpanded((prev) => !prev);
  };

  const handleCopy = async (field: "subject" | "body", text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-6 rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300">
      {/* Top Row */}
      <div className="flex items-center justify-between px-6 py-5 gap-4">
        <span className="text-lg font-semibold text-gray-900">{role}</span>
        <button
          onClick={handleExpand}
          disabled={isPending}
          className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl font-medium shadow-sm transition disabled:opacity-60 cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : expanded ? (
            <ArrowUp className="w-5 h-5" />
          ) : (
            <ArrowDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-6 pb-5 space-y-3">
          {isPending ? (
            <div className="flex justify-center items-center py-10 gap-2 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating email...</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          ) : (
            <>
              {/* Subject */}
              <div>
                <div className="flex items-center mb-1 gap-2">
                  <h4 className="text-md font-semibold text-gray-800">
                    Subject
                  </h4>
                  {subject && (
                    <button
                      onClick={() => handleCopy("subject", subject)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm cursor-pointer mt-1"
                    >
                      {copiedField === "subject" ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {subject || "No subject"}
                </p>
              </div>

              {/* Body */}
              <div>
                <div className="flex items-center mb-1 gap-2">
                  <h4 className="text-md font-semibold text-gray-800">Body</h4>
                  {body && (
                    <button
                      onClick={() => handleCopy("body", body)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm cursor-pointer mt-1"
                    >
                      {copiedField === "body" ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {body || "No body"}
                </p>
              </div>

              {/* Send Email */}
              {hr_email && body && subject && (
                <div className="flex pt-3 justify-center">
                  <a
                    href={`mailto:${hr_email}?subject=${encodeURIComponent(
                      subject
                    )}&body=${encodeURIComponent(body)}`}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Email</span>
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
