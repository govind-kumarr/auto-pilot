"use client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ArrowDown, ArrowUp, Loader2, Copy, Send, Check } from "lucide-react";
import React, { useState } from "react";

export default function Role({ role: roleObject }: { role: any }) {
  const { _id, role, body, subject, hr_email } = roleObject;
  const [expanded, setExpanded] = useState(false);

  // state for which field was copied last: 'subject' | 'body' | null
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { isPending, mutate: writeMailMutate } = useMutation({
    mutationKey: ["write-email"],
    mutationFn: (data: any) => axios.post("/api/write-mail", data),
    onSuccess: (response) => {
      console.log(response.data);
    },
  });

  const handleExpand = (roleId: string) => {
    if (!body && !subject) writeMailMutate({ roleId });
    setExpanded((prev) => !prev);
  };

  const handleCopy = async (field: "subject" | "body", text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      // revert back after 2s
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div
      key={_id}
      className="w-full max-w-xl mx-auto mb-6 rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300"
    >
      {/* Top row */}
      <div className="flex items-center justify-between px-6 py-5 gap-4">
        <span className="text-lg font-semibold text-gray-900">{role}</span>
        <button
          onClick={() => handleExpand(_id)}
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

      {/* Expanded content */}
      {expanded && (
        <div className="px-6 pb-5 space-y-3">
          {/* Subject */}
          <div>
            <div className="flex items-center mb-1 gap-2">
              <h4 className="text-md font-semibold text-gray-800 mb-1 gap-2">
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
            <p className="text-sm text-gray-600">{subject || "No subject"}</p>
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
          <div className="flex pt-3 justify-center">
            {hr_email && (
              <a
                href={`mailto:${hr_email}?subject=${encodeURIComponent(
                  subject || ""
                )}&body=${encodeURIComponent(body || "")}`}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
              >
                <Send className="w-4 h-4" />
                <span>Send Email</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
