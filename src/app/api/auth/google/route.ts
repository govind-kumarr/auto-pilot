import dbConnect from "../../../../../lib/db";
import { getGoogleOAuthTokens } from "@/utils/google_oauth_functions";
import { getGoogleUser } from "@/utils/google_profile_api";
import { NextResponse } from "next/server";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import UserModel from "../../../../../models/user_model";
import { encrypt } from "@/utils/encyption_function";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    if (!code) {
      const url = new URL("/login", request.url);
      url.searchParams.set("error", "Missing Code");
      return NextResponse.redirect(url);
    }

    const response = await getGoogleOAuthTokens({ code });
    if (response.status !== 200) {
      const url = new URL("/login", request.url);
      url.searchParams.set("error", "Error validating Google tokens");
      return NextResponse.redirect(url);
    }

    const { id_token, access_token, refresh_token } = response.data;

    const googleUser = await getGoogleUser({ id_token, access_token });
    if (!googleUser) {
      const url = new URL("/login", request.url);
      url.searchParams.set("error", "Error getting user");
      return NextResponse.redirect(url);
    }

    await dbConnect();
    const { email, name } = googleUser;

    let userRecord = await UserModel.findOne({ email });
    if (!userRecord) {
      userRecord = new UserModel({
        name,
        email,
        google_refresh_token: encrypt(refresh_token),
      });
      await userRecord.save();
    }

    const token = jwt.sign(
      { userId: userRecord._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    const cookie = serialize("auto_pilot_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    const res = NextResponse.redirect(new URL("/", request.url));
    res.headers.set("Set-Cookie", cookie);
    return res;
  } catch (error) {
    console.error(error);
    const url = new URL("/login", request.url);
    url.searchParams.set("error", "Error Authenticating User");
    return NextResponse.redirect(url);
  }
}
