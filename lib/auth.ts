import jwt from "jsonwebtoken";

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
