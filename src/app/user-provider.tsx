"use client";

import React, { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";

type User = {
  email: string;
  name?: string;
  resumeLink?: string;
} | null;

interface UserContextValue {
  user: User;
  loading: boolean;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data } = await axios.get("/api/me");
      return data.user as User;
    },
  });

  const refreshUser = () => {
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <UserContext.Provider
      value={{ user: data ?? null, loading: isLoading, refreshUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx;
};
