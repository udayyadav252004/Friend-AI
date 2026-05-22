import type {
  ChatMessage,
  CheckInMetric,
  ConversationSummary,
  MemoryItem,
  UserProfile,
} from "@/lib/types";

export const demoProfile: UserProfile = {
  id: "demo-user",
  preferredName: "Aarav",
  goals: ["Crack product interviews", "Feel calmer in relationships"],
  stressAreas: ["Interview anxiety", "Overthinking texts", "Sleep debt"],
  relationshipStatus: "Talking stage",
  examCareerPressure: "Placements in 2 months",
  preferredLanguage: "hinglish",
  comfortStyle: "Warm but practical",
  supportDepth: 78,
  communicationPreference: "Big-brother mentor vibe",
};

export const demoConversations: ConversationSummary[] = [
  {
    id: "conv-1",
    title: "Interview spiral",
    lastMessage: "Let’s map the actual fear before we solve it.",
    updatedAt: "2 min ago",
    pinned: true,
  },
  {
    id: "conv-2",
    title: "Should I text back?",
    lastMessage: "Reply with calm energy, not panic energy.",
    updatedAt: "Yesterday",
  },
  {
    id: "conv-3",
    title: "Study reset",
    lastMessage: "You do not need a perfect plan, just a steady one.",
    updatedAt: "2 days ago",
  },
];

export const demoMessages: ChatMessage[] = [];

export const demoMemories: MemoryItem[] = [
  {
    id: "memory-1",
    title: "Placement season is a major trigger",
    category: "study_stress",
    summary: "Interview anxiety spikes when comparing with peers on LinkedIn.",
    confidence: 0.91,
    pinned: true,
    visibility: "assistant_only",
    createdAt: "2 days ago",
  },
  {
    id: "memory-2",
    title: "Values thoughtful communication",
    category: "relationship_issues",
    summary: "Prefers not to reply while emotionally flooded and appreciates slow clarity.",
    confidence: 0.83,
    pinned: true,
    visibility: "shared",
    createdAt: "1 week ago",
  },
  {
    id: "memory-3",
    title: "Strongest recent breakthrough",
    category: "breakthroughs",
    summary: "Completed three mock interviews in one week and felt more grounded afterward.",
    confidence: 0.77,
    pinned: false,
    visibility: "assistant_only",
    createdAt: "10 days ago",
  },
];

export const demoCheckIns: CheckInMetric[] = [
  { date: "Mon", stress: 76, confidence: 42, focus: 50, sleep: 46, overthinking: 72, relationshipEnergy: 61, academicPressure: 81 },
  { date: "Tue", stress: 68, confidence: 47, focus: 58, sleep: 53, overthinking: 66, relationshipEnergy: 59, academicPressure: 77 },
  { date: "Wed", stress: 71, confidence: 51, focus: 62, sleep: 58, overthinking: 64, relationshipEnergy: 63, academicPressure: 73 },
  { date: "Thu", stress: 63, confidence: 57, focus: 66, sleep: 60, overthinking: 59, relationshipEnergy: 64, academicPressure: 70 },
  { date: "Fri", stress: 58, confidence: 62, focus: 68, sleep: 64, overthinking: 55, relationshipEnergy: 69, academicPressure: 68 },
  { date: "Sat", stress: 52, confidence: 66, focus: 70, sleep: 71, overthinking: 49, relationshipEnergy: 72, academicPressure: 58 },
  { date: "Sun", stress: 47, confidence: 70, focus: 74, sleep: 75, overthinking: 41, relationshipEnergy: 78, academicPressure: 49 },
];
