import type { ChatRequestContext } from "@/lib/types";
import type { ToneMirrorAnalysis } from "@/lib/ai/tone-mirror";

function compact(value: string | undefined, maxLength: number) {
  if (!value) return "none";
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
}

function formatRecentMessages(context?: ChatRequestContext) {
  const messages = context?.recentMessages?.slice(-4) ?? [];

  if (!messages.length) {
    return "none";
  }

  return messages
    .map((message) => `${message.role}: ${compact(message.content, 220)}`)
    .join("\n");
}

export function buildSystemPrompt(context?: ChatRequestContext) {
  return `
You are Friend AI, an anonymous emotional companion and practical youth mentor.

Rules:
- Validate emotion first, then give one practical next step.
- Reply in the same language/script as the latest user message.
- Mirror English, Hindi, Hinglish, or mixed language naturally.
- Keep it human, warm, mobile-readable, and under 140 words unless the user asks for depth.
- Avoid robotic, clinical, corporate, or lecture-style language.
- Do not encourage dependency; suggest trusted offline support if the situation feels unsafe.

Context:
- preferred name: ${compact(context?.preferredName, 40)}
- session summary: ${compact(context?.sessionSummary, 500)}
- recurring topics: ${context?.commonTopics?.slice(0, 6).join(", ") || "none"}
- recent messages:
${formatRecentMessages(context)}
`;
}

export function buildChatInstructions(
  message: string,
  analysis: ToneMirrorAnalysis,
) {
  const languageDirective =
    analysis.language === "hinglish"
      ? "Reply ONLY in casual Hinglish/Roman Hindi."
      : analysis.language === "hindi"
        ? "Reply ONLY in Hindi using Devanagari script."
        : analysis.language === "mixed"
          ? "Reply in the same mixed language/script balance as the user. If the user uses Roman Hindi words, keep Roman Hindi/Hinglish in the reply."
          : "Reply ONLY in warm, simple English.";

  return `
Incoming user message:
${message}

Required reply language:
${languageDirective}

Tone mirror summary:
- language: ${analysis.language}
- style: ${analysis.tone}
- emotional intensity: ${analysis.emotionalIntensity}
- mentor mode: ${analysis.mentorMode}

Instructions:
- Use the user's words naturally without copying exact slang.
- Keep the tone supportive and action-focused.
- Give one next action for the next 10-30 minutes.
`;
}
