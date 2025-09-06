import { ChatXAI } from "@langchain/xai";

const XAI_API_KEY = process.env.XAI_API_KEY;
const summarizerModel = new ChatXAI({
  apiKey: XAI_API_KEY!,
  model: "grok-3",
  temperature: 0,
  maxRetries: 2,
});

export { summarizerModel };
