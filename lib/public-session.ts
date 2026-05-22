import type { ChatMessage, SessionMemory } from "@/lib/types";

export const DEVICE_MEMORY_KEY = "mentor-ai-device-memory";
export const SESSION_MEMORY_KEY = "mentor-ai-session-memory";

export function createEmptySessionMemory(sessionId: string): SessionMemory {
  return {
    sessionId,
    rememberDevice: true,
    preferredName: "",
    preferredLanguage: "",
    preferredTone: "",
    commonTopics: [],
    summary: "",
    lastUpdatedAt: null,
  };
}

export function extractCommonTopics(messages: ChatMessage[]) {
  const joined = messages
    .filter((message) => message.role === "user")
    .map((message) => message.content.toLowerCase())
    .join(" ");

  const topicMap = [
    "exam stress",
    "overthinking",
    "relationship confusion",
    "family pressure",
    "confidence drop",
    "career tension",
  ];

  return topicMap.filter((topic) => joined.includes(topic.split(" ")[0])).slice(0, 4);
}

export function summarizeSession(messages: ChatMessage[], preferredName?: string) {
  const recentUserMessages = messages
    .filter((message) => message.role === "user")
    .slice(-3)
    .map((message) => message.content.trim())
    .filter(Boolean);

  if (!recentUserMessages.length) {
    return preferredName
      ? `${preferredName} just started talking and may want a warm, low-pressure space.`
      : "A new anonymous conversation has started and should feel warm, safe, and low-pressure.";
  }

  return recentUserMessages.join(" ").slice(0, 320);
}
