import { NextResponse } from "next/server";
import { replyAssistSchema } from "@/lib/validators";

export const runtime = "edge";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = replyAssistSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid reply assist payload." }, { status: 400 });
  }

  return NextResponse.json({
    matureReply:
      "I want to respond properly, not emotionally. Let’s talk once there’s more clarity.",
    softReply:
      "I hear you. I just need a little time before I can reply in the right way.",
    confidentReply:
      "I’m open to a conversation, but not to confusion or mixed signals.",
    emotionallyIntelligentReply:
      "I care about handling this well, so I’d rather respond once I’ve processed my thoughts instead of reacting.",
    noReplySuggestion:
      "No reply may be healthiest if this conversation repeatedly creates stress without accountability.",
    redFlagWarning:
      "Notice if the message uses guilt, urgency, or emotional pressure to bypass your boundaries.",
  });
}
