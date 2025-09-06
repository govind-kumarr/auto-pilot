import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import Role from "./role";

export default function ListRoles() {
  const { postId } = useParams();

  const { isLoading, data: availableRoles } = useQuery({
    queryKey: ["get-analyze-post", postId],
    queryFn: ({ queryKey }) => axios.get(`/api/analyze-post/${queryKey[1]}`),
    select: (response) => response.data?.availableRoles || [],
  });

  return (
    <div className="space-y-5 max-w-lg">
      <h2 className="text-xl font-semibold text-gray-800 text-center">
        Available Roles
      </h2>
      <div className="p-1">
        {!isLoading &&
          availableRoles?.map((roleObj: any) => {
            return <Role role={roleObj} />;
          })}
      </div>
    </div>
  );
}
