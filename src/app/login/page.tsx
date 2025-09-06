"use client"
import { getGoogleOAuthURL } from "@/utils/google_oauth_functions";
import React from "react";

export default function Login() {
  const handleGoogleLogin = () => {
    const googleConsentScreenURL = getGoogleOAuthURL();
    window.location.href = googleConsentScreenURL;
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-[#0D1164] via-[#640D5F] to-[#EA2264]">
      <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
        <p className="text-gray-500 text-center">
          Sign in to continue to your dashboard
        </p>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center space-x-3 bg-white border border-gray-300 rounded-xl px-6 py-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <img
            src="/google.png"
            alt="Google"
            className="w-6 h-6"
          />
          <span className="text-gray-700 font-medium">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}
