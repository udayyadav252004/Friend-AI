import { getOpenAIClient } from "@/lib/openai";
import { buildChatInstructions, buildSystemPrompt } from "@/lib/ai/prompts";
import { analyzeToneMirror } from "@/lib/ai/tone-mirror";
import { demoMemories } from "@/lib/mock-data";
import { env } from "@/lib/env";
import type { ChatRequestContext } from "@/lib/types";

const EMERGENCY_RESPONSE = {
  reply:
    "Samajh sakta hoon bhai, thoda heavy lag raha hai. Chalo ek practical step se start karte hain.",
  selectedModel: "fallback-emergency",
  tone: "warm_friend" as const,
  analysis: {
    language: "english" as const,
    tone: "warm_friend" as const,
    emotionalIntensity: 45,
  },
  fallbackUsed: true,
};

function createAbortController(timeoutMs: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  return {
    controller,
    clear: () => clearTimeout(timer),
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function getText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function extractResponseText(completion: unknown) {
  const completionRecord = asRecord(completion);
  if (!completionRecord) return "";

  const choices = completionRecord.choices;
  if (Array.isArray(choices)) {
    const firstChoice = asRecord(choices[0]);
    const message = asRecord(firstChoice?.message);
    const chatContent = getText(message?.content);

    if (chatContent) {
      return chatContent;
    }
  }

  const outputText = getText(completionRecord.output_text);
  if (outputText) {
    return outputText;
  }

  if (Array.isArray(completionRecord.output)) {
    for (const item of completionRecord.output) {
      const itemRecord = asRecord(item);

      if (itemRecord?.type === "output_text" && Array.isArray(itemRecord.content)) {
        const firstContent = asRecord(itemRecord.content[0]);
        const text = getText(firstContent?.text);

        if (text) {
          return text;
        }
      }

      if (itemRecord?.type === "message" && Array.isArray(itemRecord.content)) {
        const textBlock = itemRecord.content
          .map((block) => asRecord(block))
          .find((block) => block?.type === "output_text");

        if (Array.isArray(textBlock?.content)) {
          const firstContent = asRecord(textBlock.content[0]);
          const text = getText(firstContent?.text);

          if (text) {
            return text;
          }
        }
      }
    }
  }

  return getText(completionRecord.output);
}

function getCandidateModels() {
  return Array.from(
    new Set([
      env.OPENAI_MODEL,
      "meta-llama/llama-3.3-70b-instruct:free",
      "google/gemma-2-9b-it:free",
      "mistralai/mistral-7b-instruct:free",
      "openrouter/auto",
    ].filter(Boolean))
  );
}

export async function generateMentorReply(
  message: string,
  context: ChatRequestContext
) {
  const analysis = analyzeToneMirror(message);
  const client = getOpenAIClient();

  if (!client) {
    console.warn("No OpenRouter/OpenAI API key configured; using fallback response.");
    return EMERGENCY_RESPONSE;
  }

  const candidates = getCandidateModels();
  const primaryModel = candidates[0];

  for (const model of candidates) {
    const timeoutMs = model.includes("70b") ? 30000 : 15000;
    const { controller, clear } = createAbortController(timeoutMs);

    try {
      const completion = await client.chat.completions.create(
        {
          model,
          messages: [
            {
              role: "system",
              content: buildSystemPrompt(context, demoMemories),
            },
            {
              role: "user",
              content: buildChatInstructions(message, analysis, context),
            },
          ],
        },
        {
          signal: controller.signal,
        }
      );

      const reply = extractResponseText(completion);

      if (!reply) {
        console.error("OpenRouter returned no text", { model });
        continue;
      }

      return {
        reply,
        selectedModel: model,
        tone: analysis.tone,
        analysis,
        fallbackUsed: model !== primaryModel,
      };
    } catch (error) {
      console.error("❌ OpenRouter request failed");
      console.error("MODEL:", model);
      console.error("ERROR:", error);
      console.error("MESSAGE:", (error as Error)?.message);
      continue;
    } finally {
      clear();
    }
  }

  console.warn("All configured OpenRouter models failed; using fallback response.");
  return {
    reply:
      "Bhai main abhi AI provider se connect nahi kar paa raha. Thoda sa wait karke dobara try kar, aur agar ye repeat ho raha hai to API key/model settings check karni padengi.",
    selectedModel: "provider-fallback",
    tone: analysis.tone,
    analysis,
    fallbackUsed: true,
  };
}
