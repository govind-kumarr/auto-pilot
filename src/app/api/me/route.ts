import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "../../../../lib/auth";
import UserModel from "../../../../models/user_model";
import dbConnect from "../../../../lib/db";

export async function GET(request: NextRequest) {
  try {
    const userId = getUserFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const user = await UserModel.findById(userId);
    if (user) {
      return NextResponse.json(
        { user: { email: user?.email, resumeLink: user?.resumeLink } },
        { status: 200 }
      );
    }
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
