import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export function verifyAndDecodeToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as { userId: string; [key: string]: any };
  } catch (err) {
    console.error("JWT verification failed", err);
    return null;
  }
}

export function getUserFromRequest(request: NextRequest) {
  const token = request.cookies.get("auto_pilot_session")?.value;
  if (!token) return null;

  try {
    const decoded = verifyAndDecodeToken(token);
    return decoded?.userId || null;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
}
