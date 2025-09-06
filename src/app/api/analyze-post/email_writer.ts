import { ChatXAI } from "@langchain/xai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { emailWriterPrompt } from "@/app/prompts/auto_pilot_prompts";

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    subject: z.string().max(100),
    body: z.string().max(1000),
  })
);

const emailWriterModel = new ChatXAI({
  temperature: 0,
  apiKey: process.env.XAI_API_KEY,
  model: "grok-3",
}).pipe(parser);

async function prepareEmail(
  role: string,
  summary: string
) {
  try {
    const finalPrompt = emailWriterPrompt({
      role,
      summary,
    });
    const response = await emailWriterModel.invoke(finalPrompt);
    if (response) {
      const { body, subject } = response;
      return { body, subject };
    }
  } catch (error) {
    console.error("Error in generating applications:", error);
    throw error;
  }
}

export { prepareEmail };
