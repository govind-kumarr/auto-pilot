import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auto_pilot_session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
  runtime: "nodejs",
};
