"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import Role from "./role";

export default function ListRoles() {
  const { postId } = useParams();

  const { isLoading, data: availableRoles = [] } = useQuery({
    queryKey: ["get-analyze-post", postId],
    queryFn: ({ queryKey }) =>
      axios.get(`/api/analyze-post/${queryKey[1]}`),
    select: (res) => res.data?.availableRoles || [],
  });

  return (
    <div className="max-w-lg mx-auto pt-16 px-4 h-[calc(100vh-4rem)] flex flex-col">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Available Roles
      </h2>

      <div className="flex-1 overflow-y-auto space-y-5">
        {isLoading ? (
          <div className="flex justify-center items-center py-10 text-gray-500 gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            Loading roles...
          </div>
        ) : availableRoles.length === 0 ? (
          <p className="text-center text-gray-500">No roles available</p>
        ) : (
          availableRoles.map((roleObj: any) => (
            <Role key={roleObj._id} role={roleObj} />
          ))
        )}
      </div>
    </div>
  );
}
