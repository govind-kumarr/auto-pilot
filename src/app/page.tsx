"use client";
import { useState } from "react";
import FetchPost from "./components/fetch-post";
import ListRoles from "./components/list-roles";

export default function AutoPilot() {
  const [step, setStep] = useState(1);

  return (
    <div className="flex flex-col justify-center">
      {step === 1 && <FetchPost />}
      {step === 2 && <ListRoles />}
    </div>
  );
}
