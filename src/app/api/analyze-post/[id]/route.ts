import { NextRequest, NextResponse } from "next/server";
import { verifyAndDecodeToken } from "../../../../../lib/auth";
import PostModel from "../../../../../models/post_model";
import RoleModel from "../../../../../models/role_model";
import dbConnect from "../../../../../lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // const token = request.cookies.get("auto_pilot_session")?.value;

    // const decoded = token ? verifyAndDecodeToken(token) : null;
    // if (!decoded)
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // const userId = decoded.userId;
    const { id } = await params;
    await dbConnect();
    const exist = await PostModel.findById(id);
    if (exist) {
      const roles = await RoleModel.find({ originalPost: exist?._id });
      return NextResponse.json({ availableRoles: roles }, { status: 200 });
    }
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
