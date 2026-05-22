"use server";

import { chatSchema, replyAssistSchema } from "@/lib/validators";
import { generateMentorReply } from "@/lib/ai/chat";

export async function sendChatMessageAction(formData: FormData) {
  const parsed = chatSchema.safeParse({
    message: formData.get("message"),
    sessionId: formData.get("sessionId") ?? "legacy-session",
  });

  if (!parsed.success) {
    return {
      success: false as const,
      error: "Please write a message before sending.",
    };
  }

  const result = await generateMentorReply(parsed.data.message, {
    sessionId: parsed.data.sessionId,
  });

  return {
    success: true as const,
    ...result,
  };
}

export async function replyAssistAction(formData: FormData) {
  const parsed = replyAssistSchema.safeParse({
    input: formData.get("input"),
  });

  if (!parsed.success) {
    return {
      success: false as const,
      error: "Paste a longer chat snippet to generate useful replies.",
    };
  }

  return {
    success: true as const,
    variants: {
      matureReply:
        "I want to reply with clarity, not emotion. Let’s talk once we’re both calmer so we can understand each other properly.",
      softReply:
        "I get where you’re coming from. I just need a little time to think so I can respond properly.",
      confidentReply:
        "I’m not okay with mixed signals. If we’re talking, I’d prefer honesty and consistency.",
      emotionallyIntelligentReply:
        "I don’t want this to become reactive. I value the connection, so I’d rather respond after I’ve had time to process and be fair to both of us.",
      noReplySuggestion:
        "If the other person is repeatedly disrespectful or baiting you into a fight, no reply may protect your peace better than another round of explaining.",
      redFlagWarning:
        "Watch for guilt-tripping, blame shifting, or only reaching out when they want emotional access without accountability.",
    },
  };
}
