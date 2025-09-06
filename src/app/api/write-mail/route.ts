import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import RoleModel from "../../../../models/role_model";
import UserModel from "../../../../models/user_model";
import { getUserFromRequest } from "../../../../lib/auth";
import { prepareEmail } from "../analyze-post/email_writer";
import { generateResumeUrl } from "@/utils/aws_functions";

export async function POST(request: NextRequest) {
  try {
    const userId = getUserFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { roleId } = await request.json();
    if (!roleId) {
      return NextResponse.json(
        { message: "roleId is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const roleRecord = await RoleModel.findById(roleId);
    if (!roleRecord) {
      return NextResponse.json({ message: "Role not found" }, { status: 404 });
    }

    if (!roleRecord.body || !roleRecord.subject) {
      const mail = await prepareEmail(roleRecord.role, user.resumeSummary);
      if (!mail) {
        return NextResponse.json(
          { message: "Failed to generate email" },
          { status: 500 }
        );
      }

      const resumeLink = `${process.env.APP_URL}/api/resume/${userId}`;

      roleRecord.subject = mail.subject;
      roleRecord.body = `${mail.body}\nHere is my resume link: ${resumeLink}`;
      await roleRecord.save();
    }

    return NextResponse.json(roleRecord, { status: 200 });
  } catch (error) {
    console.error("Error in POST /write-mail:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
