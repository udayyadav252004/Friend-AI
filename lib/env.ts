import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  OPENROUTER_API_KEY: z.string().optional(),
  OPENAI_MODEL: z
  .string()
  .default("deepseek/deepseek-chat-v3-0324:free"),
  NEXT_PUBLIC_ENABLE_DEVICE_MEMORY: z.string().default("true"),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL,
  NEXT_PUBLIC_ENABLE_DEVICE_MEMORY: process.env.NEXT_PUBLIC_ENABLE_DEVICE_MEMORY,
});

if (!parsed.success) {
  throw new Error(`Invalid environment variables: ${parsed.error.message}`);
}

export const env = parsed.data;
