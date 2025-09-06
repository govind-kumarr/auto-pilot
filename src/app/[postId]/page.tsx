"use client";
import { useState } from "react";
import FetchPost from "../components/fetch-post";
import ListRoles from "../components/list-roles";
import Providers from "../providers";
import { UserProvider } from "../user-provider";

export default function AutoPilot({ params }: { params: { slug?: string[] } }) {
  return (
    <Providers>
      <UserProvider>
        <div className="w-screen h-screen flex flex-col justify-center items-center">
          <ListRoles />
        </div>
      </UserProvider>
    </Providers>
  );
}
