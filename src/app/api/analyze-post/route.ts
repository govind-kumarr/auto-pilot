import { NextRequest, NextResponse } from "next/server";
import { scrapeLinkedInPost } from "./linkedin_post_scrapper";
import { analyzePost } from "./post_analyzer";
// import { testSummary } from "@/app/prompts/auto_pilot_prompts";
import PostModel from "../../../../models/post_model";
import RoleModel from "../../../../models/role_model";
import { getUserFromRequest, verifyAndDecodeToken } from "../../../../lib/auth";
import dbConnect from "../../../../lib/db";

export async function POST(request: NextRequest) {
  try {
    const userId = getUserFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    await dbConnect();
    const { url } = await request.json();
    let post = await PostModel.findOne({ url });
    let postContent;
    if (post) {
      postContent = post.postContent;
      if (post?.analyzed) {
        return NextResponse.json({ postId: post?._id }, { status: 200 });
      }
    } else {
      postContent = await scrapeLinkedInPost(url);
      post = new PostModel({
        url,
        postContent,
        // scrapedBy: userId,
      });
      post = await post.save();
    }
    const analysisReport = await analyzePost({
      post_content: postContent,
      // summary: testSummary,
    });
    if (analysisReport) {
      post.analyzed = true;
      await post.save();
      const { roles, hr_email } = analysisReport;
      const roleRecords = roles.map((role) => ({
        role,
        hr_email,
        // scrapedBy: userId,
        originalPost: post?._id,
      }));
      await RoleModel.insertMany(roleRecords);
      return NextResponse.json({ postId: post?._id }, { status: 200 });
    }
    return NextResponse.json(
      { message: "Error analyzing report." },
      { status: 500 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
