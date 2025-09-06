import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { HumanMessage } from "@langchain/core/messages";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { summarizerModel } from "./resume-summary";
import { summarizerPrompt } from "@/app/prompts/auto_pilot_prompts";
import { getUserFromRequest } from "../../../../lib/auth";
import UserModel from "../../../../models/user_model";
import s3 from "@/utils/aws_functions";
import dbConnect from "../../../../lib/db";

export async function POST(req: NextRequest) {
  try {
    const userId = getUserFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    if (
      file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      return NextResponse.json(
        { message: "Only PDF files allowed" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const key = `${userId.toString()}.pdf`;
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: key,
          Body: buffer,
          ContentType: "application/pdf",
        })
      );
    } catch (err) {
      console.error("S3 upload failed:", err);
      return NextResponse.json(
        { message: "Failed to upload file to S3" },
        { status: 500 }
      );
    }

    let summaryText = "";
    try {
      const pdfBlob = new Blob([buffer], { type: "application/pdf" });
      const pdfLoader = new PDFLoader(pdfBlob);
      const docs = await pdfLoader.load();
      const content = docs.map((doc: any) => doc.pageContent).join("\n");
      const summary = await summarizerModel.invoke([
        new HumanMessage(summarizerPrompt(content)),
      ]);
      summaryText =
        summary?.content instanceof Array
          ? summary?.content.join("\n")
          : (summary.content as string);
    } catch (err) {
      console.error("Summarization failed:", err);
    }
    await UserModel.findByIdAndUpdate(userId, {
      resumeLink: true,
      resumeSummary: summaryText,
    });

    return NextResponse.json({
      message: "PDF uploaded & summarized successfully",
      key,
      summary: summaryText,
    });
  } catch (err) {
    console.error("Unexpected error in upload handler:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
