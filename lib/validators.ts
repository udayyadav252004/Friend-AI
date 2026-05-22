import { z } from "zod";

export const onboardingSchema = z.object({
  preferredName: z.string().min(2),
  goals: z.string().min(4),
  stressAreas: z.string().min(4),
  relationshipStatus: z.string().min(2),
  examCareerPressure: z.string().min(2),
  preferredLanguage: z.enum(["english", "hindi", "hinglish", "mixed"]),
  comfortStyle: z.string().min(2),
  supportDepth: z.coerce.number().min(1).max(100),
  communicationPreference: z.string().min(2),
});

export const chatSchema = z.object({
  message: z.string().min(1).max(4000),
  sessionId: z.string().min(8).max(120).optional(),
  preferredName: z.string().max(40).optional(),
  sessionSummary: z.string().max(2000).optional(),
  commonTopics: z.array(z.string().max(60)).max(8).optional(),
  recentMessages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(2000),
      }),
    )
    .max(8)
    .optional(),
});

export const replyAssistSchema = z.object({
  input: z.string().min(8).max(8000),
});

export const memorySchema = z.object({
  title: z.string().min(2),
  summary: z.string().min(6),
  category: z.string().min(2),
  visibility: z.enum(["private", "assistant_only", "shared"]),
  pinned: z.boolean().default(false),
});
