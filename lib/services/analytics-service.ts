import { formatDuration } from "@/lib/utils";

export async function getAdminMetrics() {
  return {
    dau: 1842,
    wau: 6210,
    retention: 41,
    averageSessionTime: formatDuration(18),
    moodCheckInCompletion: 67,
    topPromptCategories: [
      { label: "Career stress", value: 32 },
      { label: "Relationship confusion", value: 25 },
      { label: "Overthinking", value: 19 },
      { label: "Study planning", value: 14 },
    ],
    featureUsage: [
      { label: "Chat", value: 88 },
      { label: "Check-in", value: 62 },
      { label: "Reply Assist", value: 38 },
      { label: "Voice", value: 21 },
      { label: "Memory Center", value: 29 },
    ],
    churnIndicators: [
      "3-day drop in check-ins after placement deadlines",
      "Users with <2 saved memories return less often",
      "Reply Assist users have stronger week-2 retention",
    ],
  };
}
