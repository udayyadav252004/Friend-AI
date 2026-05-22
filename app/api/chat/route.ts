import { NextResponse } from "next/server";
import { chatSchema } from "@/lib/validators";
import { generateMentorReply } from "@/lib/ai/chat";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const EDGE_RESPONSE_TIMEOUT_MS = 22000;

function getErrorDetails(error: unknown) {
  if (error instanceof Error) {
    const details: {
      name: string;
      message: string;
      attempts?: unknown;
    } = {
      name: error.name,
      message: error.message,
    };

    if ("attempts" in error) {
      details.attempts = error.attempts;
    }

    return {
      ...details,
    };
  }

  return {
    name: "UnknownError",
    message: "Unknown chat API failure.",
  };
}

export async function POST(request: Request) {
  const requestId = globalThis.crypto?.randomUUID?.() ?? Date.now().toString(36);
  const timeoutController = new AbortController();
  const timeout = setTimeout(() => timeoutController.abort(), EDGE_RESPONSE_TIMEOUT_MS);

  try {
    const body = await request.json();
    const parsed = chatSchema.safeParse(body);

    if (!parsed.success) {
      console.error("Invalid chat payload", {
        requestId,
        issues: parsed.error.flatten(),
      });

      return NextResponse.json(
        {
          error: "Invalid chat payload.",
          requestId,
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await generateMentorReply(parsed.data.message, {
      sessionId: parsed.data.sessionId,
      preferredName: parsed.data.preferredName,
      sessionSummary: parsed.data.sessionSummary,
      commonTopics: parsed.data.commonTopics,
      recentMessages: parsed.data.recentMessages,
    }, {
      signal: timeoutController.signal,
      deadlineMs: Date.now() + EDGE_RESPONSE_TIMEOUT_MS,
    });

    return NextResponse.json({
      reply: result.reply,
      selectedModel: result.selectedModel,
      tone: result.tone,
      analysis: result.analysis,
      fallbackUsed: result.fallbackUsed ?? false,
      requestId,
    });
  } catch (error) {
    const details = getErrorDetails(error);

    console.error("Chat API failed", {
      requestId,
      ...details,
      error,
    });

    return NextResponse.json(
      {
        error: "Could not process the chat request right now.",
        requestId,
        details,
      },
      { status: details.name === "ChatTimeoutError" ? 504 : 500 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
