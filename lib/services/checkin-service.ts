import { demoCheckIns } from "@/lib/mock-data";

export async function listCheckInMetrics() {
  return demoCheckIns;
}

export async function getMoodPatternInsight() {
  const last = demoCheckIns[demoCheckIns.length - 1];
  const first = demoCheckIns[0];

  return {
    stressDelta: last.stress - first.stress,
    confidenceDelta: last.confidence - first.confidence,
    summary:
      "Stress is trending down while confidence, sleep, and focus are gradually recovering. Comparison spikes still correlate with placement pressure days.",
  };
}
