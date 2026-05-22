import { demoMemories } from "@/lib/mock-data";
import type { MemoryItem } from "@/lib/types";

export async function listMemories(): Promise<MemoryItem[]> {
  return demoMemories;
}

export async function summarizeMemoryInsights() {
  const highConfidence = demoMemories.filter((memory) => memory.confidence > 0.8).length;
  const topTrigger = demoMemories.find((memory) => memory.category === "study_stress");

  return {
    total: demoMemories.length,
    highConfidence,
    topTrigger: topTrigger?.summary ?? "No dominant trigger found yet.",
  };
}
