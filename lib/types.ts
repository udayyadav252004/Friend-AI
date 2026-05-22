export type LanguageMode = "english" | "hindi" | "hinglish" | "mixed";

export type ToneStyle =
  | "warm_friend"
  | "mentor"
  | "practical_coach"
  | "big_brother"
  | "reflective";

export type UserProfile = {
  id: string;
  preferredName: string;
  goals: string[];
  stressAreas: string[];
  relationshipStatus: string;
  examCareerPressure: string;
  preferredLanguage: LanguageMode;
  comfortStyle: string;
  supportDepth: number;
  communicationPreference: string;
};

export type ConversationSummary = {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  pinned?: boolean;
};

export type CheckInMetric = {
  date: string;
  stress: number;
  confidence: number;
  focus: number;
  sleep: number;
  overthinking: number;
  relationshipEnergy: number;
  academicPressure: number;
};

export type MemoryItem = {
  id: string;
  title: string;
  category:
    | "personal_goals"
    | "relationship_issues"
    | "study_stress"
    | "habits"
    | "recurring_fears"
    | "breakthroughs"
    | "milestones"
    | "emotional_triggers";
  summary: string;
  confidence: number;
  pinned: boolean;
  visibility: "private" | "assistant_only" | "shared";
  createdAt: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
  language: LanguageMode;
  tone: ToneStyle;
};

export type SessionMemory = {
  sessionId: string;
  rememberDevice: boolean;
  preferredName: string;
  preferredLanguage: LanguageMode | "";
  preferredTone: ToneStyle | "";
  commonTopics: string[];
  summary: string;
  lastUpdatedAt: string | null;
};

export type ChatRequestContext = {
  sessionId?: string;
  preferredName?: string;
  sessionSummary?: string;
  commonTopics?: string[];
  recentMessages?: Array<Pick<ChatMessage, "role" | "content">>;
};
