"use client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function FetchPost() {
  const [postUrl, setPostUrl] = useState(""); //https://www.linkedin.com/posts/sweeti-kumari-6a086b20b_nickelfoxtechnologies-wearehiring-techjobs-activity-7367147085864849410-91Vt?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD37G6wBIqAMEKKZuiBtzbXdU24F8cLjIdk
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: any) => {
      const res = await axios.post("/api/analyze-post", payload);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("✅ API Response:", data);
      if (data?.postId) {
        router.push(`/${data.postId}`);
      }
    },
    onError: (error) => {
      console.error("❌ API Error:", error);
    },
  });

  const handleSubmit = () => {
    if (!postUrl.trim()) return;
    mutate({ url: postUrl });
  };

  function isValidLinkedInPostUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      if (!parsed.hostname.includes("linkedin.com")) return false;
      const path = parsed.pathname;

      const postRegexes = [
        /^\/posts\/.+/i,
        /^\/feed\/update\/urn:li:activity:\d+/i,
      ];

      return postRegexes.some((re) => re.test(path));
    } catch (err) {
      return false;
    }
  }

  return (
    <div className="w-full flex justify-center items-center py-12 px-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden transition hover:shadow-xl">
          <input
            type="url"
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
            placeholder="Paste LinkedIn post URL..."
            className="flex-1 px-5 py-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || !isValidLinkedInPostUrl(postUrl)}
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-4 flex items-center justify-center disabled:opacity-50 cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
