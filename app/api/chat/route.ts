import { NextResponse } from "next/server";
import { chatSchema } from "@/lib/validators";
import { generateMentorReply } from "@/lib/ai/chat";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = chatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid chat payload." }, { status: 400 });
    }

    const result = await generateMentorReply(parsed.data.message, {
      sessionId: parsed.data.sessionId,
      preferredName: parsed.data.preferredName,
      sessionSummary: parsed.data.sessionSummary,
      commonTopics: parsed.data.commonTopics,
      recentMessages: parsed.data.recentMessages,
    });

    return NextResponse.json({
      reply: result.reply,
      selectedModel: result.selectedModel,
      tone: result.tone,
      analysis: result.analysis,
      fallbackUsed: result.fallbackUsed ?? false,
    });
  } catch (error) {
    console.error("Chat API failed", error);
    return NextResponse.json(
      { error: "Could not process the chat request right now." },
      { status: 500 },
    );
  }
}
