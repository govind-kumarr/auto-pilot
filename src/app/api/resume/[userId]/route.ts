import { NextRequest, NextResponse } from "next/server";
import { generateResumeUrl } from "@/utils/aws_functions";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ message: "User ID missing" }, { status: 400 });
  }

  try {
    const presignedUrl = await generateResumeUrl(`${userId}.pdf`);
    return NextResponse.redirect(presignedUrl);
  } catch (err) {
    console.error("Failed to generate presigned URL", err);
    return NextResponse.json(
      { message: "Failed to get resume" },
      { status: 500 }
    );
  }
}
