"use client";
import { getGoogleOAuthURL } from "@/utils/google_oauth_functions";
import React from "react";

export default function Login() {
  const handleGoogleLogin = () => {
    const googleConsentScreenURL = getGoogleOAuthURL();
    window.location.href = googleConsentScreenURL;
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-primary via-accent to-secondary">
      <div className="bg-foreground rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-background">Welcome Back</h1>
        <p className="text-muted text-center">
          Sign in to continue to your dashboard
        </p>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center space-x-3 bg-background border border-border rounded-xl px-6 py-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <img src="/google.png" alt="Google" className="w-6 h-6" />
          <span className="text-foreground font-medium">
            Sign in with Google
          </span>
        </button>
      </div>
    </div>
  );
}
