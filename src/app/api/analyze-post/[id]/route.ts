import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, verifyAndDecodeToken } from "../../../../../lib/auth";
import PostModel from "../../../../../models/post_model";
import RoleModel from "../../../../../models/role_model";
import dbConnect from "../../../../../lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
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
