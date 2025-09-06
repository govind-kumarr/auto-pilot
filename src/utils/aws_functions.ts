import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function generateResumeUrl(key: string) {
  if (!key) throw new Error("S3 object key is required");

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
  });

  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 604800 });
    return url;
  } catch (err) {
    console.error("Failed to generate S3 URL:", err);
    throw new Error("Could not generate resume URL");
  }
}

export default s3;
