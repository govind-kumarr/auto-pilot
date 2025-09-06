import React, { useState } from "react";
import { useUser } from "../user-provider";
import UploadResume from "./upload-resume";
import FetchPost from "./fetch-post";
import ListRoles from "./list-roles";

export default function Home() {
  const { user } = useUser();
  const [step, setStep] = useState(user?.resumeLink ? 1 : 0);
  return (
    <div className="flex flex-col justify-center">
      {step === 0 && <UploadResume />}
      {step === 1 && <FetchPost />}
      {step === 2 && <ListRoles />}
    </div>
  );
}
