import { NextRequest, NextResponse } from "next/server";
import { verifyAndDecodeToken } from "../../../../lib/auth";
import dbConnect from "../../../../lib/db";
import RoleModel from "../../../../models/role_model";
import { prepareEmail } from "../analyze-post/email_writer";
// import { testSummary } from "@/app/prompts/auto_pilot_prompts";

export async function POST(request: NextRequest) {
  try {
    // const token = request.cookies.get("auto_pilot_session")?.value;

    // const decoded = token ? verifyAndDecodeToken(token) : null;
    // if (!decoded)
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // const userId = decoded.userId;
    const { roleId } = await request.json();
    await dbConnect();
    const roleRecord = await RoleModel.findById(roleId);
    console.log(`Role Record`, roleRecord);
    if (roleRecord) {
      const { role, body, subject } = roleRecord;
      console.log(`Body Subject`, body, subject);
      if (!body && !subject) {
        const mail = await prepareEmail(role);
        console.log(`Mail`, mail);
        if (mail) {
          const { body, subject } = mail;
          console.log(`Body Subject - gen`, body, subject);
          roleRecord.subject = subject;
          roleRecord.body = body;
          await roleRecord.save();
          return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
          );
        }
      } else return NextResponse.json(roleRecord, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
