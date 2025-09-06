"use client";
import { useState } from "react";
import FetchPost from "../components/fetch-post";
import ListRoles from "../components/list-roles";

export default function AutoPilot({ params }: { params: { slug?: string[] } }) {
  const [step, setStep] = useState(1);
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <ListRoles />
    </div>
  );
}
