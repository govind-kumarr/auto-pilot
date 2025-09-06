import crypto from "crypto";

const algorithm = "aes-256-gcm";
const key = crypto
  .createHash("sha256")
  .update(String(process.env.REFRESH_TOKEN_KEY))
  .digest();
const iv = crypto.randomBytes(16);

export function encrypt(text: string) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return iv.toString("hex") + ":" + authTag + ":" + encrypted;
}

export function decrypt(encrypted: string) {
  const [ivHex, authTagHex, content] = encrypted.split(":");
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(ivHex, "hex")
  );
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
  let decrypted = decipher.update(content, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
