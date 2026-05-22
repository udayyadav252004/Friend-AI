import { getOpenAIClient } from "@/lib/openai";
import { buildChatInstructions, buildSystemPrompt } from "@/lib/ai/prompts";
import { analyzeToneMirror } from "@/lib/ai/tone-mirror";
import { env } from "@/lib/env";
import type { ChatRequestContext } from "@/lib/types";

const PRIMARY_MODEL = "deepseek/deepseek-chat-v3-0324:free";
const FALLBACK_MODELS = ["google/gemini-flash-1.5", "openai/gpt-3.5-turbo"] as const;
const RETIRED_SLOW_MODELS = new Set(["meta-llama/llama-3.3-70b-instruct:free"]);
const MAX_COMPLETION_TOKENS = 360;
const DEFAULT_MODEL_TIMEOUT_MS = 6500;
const PRIMARY_MODEL_TIMEOUT_MS = 9000;

type GenerateOptions = {
  signal?: AbortSignal;
  deadlineMs?: number;
};

type OpenRouterAttempt = {
  model: string;
  durationMs: number;
  error: string;
};

class ChatTimeoutError extends Error {
  attempts: OpenRouterAttempt[];

  constructor(message: string, attempts: OpenRouterAttempt[] = []) {
    super(message);
    this.name = "ChatTimeoutError";
    this.attempts = attempts;
  }
}

class ChatProviderError extends Error {
  attempts: OpenRouterAttempt[];

  constructor(message: string, attempts: OpenRouterAttempt[]) {
    super(message);
    this.name = "ChatProviderError";
    this.attempts = attempts;
  }
}

function createAbortController(timeoutMs: number, parentSignal?: AbortSignal) {
  const controller = new AbortController();

  const abortFromParent = () => {
    controller.abort(parentSignal?.reason);
  };

  if (parentSignal?.aborted) {
    abortFromParent();
  } else {
    parentSignal?.addEventListener("abort", abortFromParent, { once: true });
  }

  const timer = setTimeout(() => {
    controller.abort(new ChatTimeoutError(`OpenRouter request timed out after ${timeoutMs}ms.`));
  }, timeoutMs);

  return {
    controller,
    clear: () => {
      clearTimeout(timer);
      parentSignal?.removeEventListener("abort", abortFromParent);
    },
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

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return typeof error === "string" ? error : "Unknown OpenRouter error";
}

function isAbortError(error: unknown) {
  return (
    error instanceof ChatTimeoutError ||
    (error instanceof Error && error.name === "AbortError") ||
    getErrorMessage(error).toLowerCase().includes("abort")
  );
}

function isTimeoutAttempt(attempt: OpenRouterAttempt) {
  const error = attempt.error.toLowerCase();
  return error.includes("timed out") || error.includes("abort");
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

  return getText(completionRecord.output);
}

function normalizeConfiguredModel(model: string | undefined) {
  if (!model || RETIRED_SLOW_MODELS.has(model)) {
    return PRIMARY_MODEL;
  }

  return model;
}

function getCandidateModels() {
  return Array.from(
    new Set([
      normalizeConfiguredModel(env.OPENAI_MODEL),
      PRIMARY_MODEL,
      ...FALLBACK_MODELS,
    ]),
  ).filter((model) => !RETIRED_SLOW_MODELS.has(model));
}

function getAttemptTimeoutMs(model: string, deadlineMs?: number) {
  const baseTimeout = model === PRIMARY_MODEL ? PRIMARY_MODEL_TIMEOUT_MS : DEFAULT_MODEL_TIMEOUT_MS;

  if (!deadlineMs) {
    return baseTimeout;
  }

  const remainingMs = deadlineMs - Date.now() - 750;
  return Math.max(0, Math.min(baseTimeout, remainingMs));
}

export async function generateMentorReply(
  message: string,
  context: ChatRequestContext,
  options: GenerateOptions = {},
) {
  const analysis = analyzeToneMirror(message);
  const client = getOpenAIClient();

  if (!client) {
    throw new ChatProviderError("OpenRouter client is not configured.", []);
  }

  const attempts: OpenRouterAttempt[] = [];
  const candidates = getCandidateModels();
  const primaryModel = candidates[0];
  const messages = [
    {
      role: "system" as const,
      content: buildSystemPrompt(context),
    },
    {
      role: "user" as const,
      content: buildChatInstructions(message, analysis),
    },
  ];

  for (const model of candidates) {
    const timeoutMs = getAttemptTimeoutMs(model, options.deadlineMs);

    if (timeoutMs < 1000 || options.signal?.aborted) {
      throw new ChatTimeoutError(
        "Chat request timed out before OpenRouter returned a response.",
        attempts,
      );
    }

    const startedAt = Date.now();
    const { controller, clear } = createAbortController(timeoutMs, options.signal);

    try {
      const completion = await client.chat.completions.create(
        {
          model,
          messages,
          max_tokens: MAX_COMPLETION_TOKENS,
          temperature: 0.65,
          top_p: 0.9,
        },
        {
          signal: controller.signal,
        },
      );

      const reply = extractResponseText(completion);

      if (!reply) {
        const durationMs = Date.now() - startedAt;
        attempts.push({ model, durationMs, error: "OpenRouter returned no text." });
        console.error("OpenRouter returned no text", { model, durationMs });
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
      const durationMs = Date.now() - startedAt;
      const errorMessage = getErrorMessage(error);

      attempts.push({ model, durationMs, error: errorMessage });
      console.error("OpenRouter request failed", {
        model,
        durationMs,
        error: errorMessage,
      });

      if (options.signal?.aborted) {
        throw new ChatTimeoutError(
          "Chat request timed out before OpenRouter returned a response.",
          attempts,
        );
      }

      if (!isAbortError(error)) {
        continue;
      }
    } finally {
      clear();
    }
  }

  if (attempts.length && attempts.every(isTimeoutAttempt)) {
    throw new ChatTimeoutError("All OpenRouter model attempts timed out.", attempts);
  }

  console.error("All OpenRouter chat models failed", { attempts });
  throw new ChatProviderError("All OpenRouter chat models failed.", attempts);
}
