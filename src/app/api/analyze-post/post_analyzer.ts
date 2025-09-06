import { ChatXAI } from "@langchain/xai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { postAnalyzerPrompt } from "./../../prompts/auto_pilot_prompts";

const schema = z.object({
  hr_email: z.string().email(),
  roles: z.array(z.string()),
});

export type PostAnalysisResult = z.infer<typeof schema>;

const parser = StructuredOutputParser.fromZodSchema(schema);

const postAnalyzerModel = new ChatXAI({
  temperature: 0,
  apiKey: process.env.XAI_API_KEY,
  model: "grok-3",
}).pipe(parser);

async function analyzePost({
  post_content,
}: // summary,
{
  post_content: string;
  // summary: string;
}) {
  try {
    const finalPrompt = postAnalyzerPrompt({
      post_content,
      // summary,
    });
    return postAnalyzerModel.invoke(finalPrompt);
  } catch (error) {
    console.error(error);
  }
}

export { analyzePost };
