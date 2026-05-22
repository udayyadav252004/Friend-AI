import OpenAI from "openai";
import { env } from "@/lib/env";

let client: OpenAI | null = null;

export function getOpenAIClient() {
  const apiKey =
    env.OPENROUTER_API_KEY || env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error("No OpenRouter/OpenAI key found");
    return null;
  }

  if (!client) {
    client = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": env.NEXT_PUBLIC_APP_URL,
        "X-Title": "Friend AI",
      },
    });
  }

  return client;
}
