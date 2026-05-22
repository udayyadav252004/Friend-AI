import type { LanguageMode, ToneStyle } from "@/lib/types";

export type ToneMirrorAnalysis = {
  language: LanguageMode;
  tone: ToneStyle;
  emotionalIntensity: number;
  mentorMode: "friend" | "mentor" | "coach";
  adviceType: "emotional_support" | "practical_advice" | "deep_reflection";
  speedPreference: "slow" | "steady" | "quick";
  reasoning: string;
};

const hinglishSignals = [
  "arey",
  "arre",
  "aur",
  "yaar",
  "bro",
  "bhai",
  "bhia",
  "bhiya",
  "bhaiya",
  "dimag",
  "kya",
  "kaisa",
  "kaisi",
  "kaise",
  "nahi",
  "hai",
  "hain",
  "hu",
  "ho",
  "kar raha",
  "kar rha",
  "scene",
  "acha",
  "accha",
  "achha",
  "samajh",
  "mujhe",
];

const hindiSignals = [
  "main",
  "mai",
  "mein",
  "mera",
  "meri",
  "mujhe",
  "tum",
  "aap",
  "aur",
  "kya",
  "kaisa",
  "kaisi",
  "kaise",
  "kyu",
  "kyun",
  "nahi",
  "haan",
  "theek",
  "thik",
  "accha",
  "achha",
  "bata",
  "karna",
  "chahiye",
];

const intenseSignals = [
  "panic",
  "anxious",
  "kharab",
  "cry",
  "stuck",
  "overthinking",
  "scared",
  "heartbroken",
  "lonely",
  "depressed",
  "pressure",
];

const playfulSignals = ["lol", "haha", "bro", "lmao", "scene kya hai", "funny"];
const reflectiveSignals = ["feel", "why", "meaning", "reflect", "understand", "processing"];
const practicalSignals = ["plan", "study", "career", "exam", "interview", "job", "goal", "project", "step"];

export function analyzeToneMirror(input: string): ToneMirrorAnalysis {
  const normalized = input.toLowerCase();
  const hasDevanagari = /[\u0900-\u097f]/.test(input);
  const hinglishScore = hinglishSignals.filter((term) => normalized.includes(term)).length;
  const hindiScore = hindiSignals.filter((term) => normalized.includes(term)).length;
  const words = normalized.match(/[a-z]+/g) ?? [];
  const englishScore = words.filter((word) => /^[a-z]+$/.test(word)).length;
  const romanHindiScore = hinglishScore + hindiScore;
  const intenseScore = intenseSignals.filter((term) => normalized.includes(term)).length;
  const playfulScore = playfulSignals.filter((term) => normalized.includes(term)).length;
  const reflectiveScore = reflectiveSignals.filter((term) => normalized.includes(term)).length;
  const practicalScore = practicalSignals.filter((term) => normalized.includes(term)).length;

  const language: LanguageMode = hasDevanagari
    ? englishScore > 2
      ? "mixed"
      : "hindi"
    : romanHindiScore >= 2
      ? "hinglish"
      : romanHindiScore > 0 && englishScore > 3
        ? "mixed"
        : "english";

  const emotionalIntensity = Math.min(100, 30 + intenseScore * 18 + (normalized.includes("!") ? 8 : 0));

  let tone: ToneStyle = "mentor";
  let mentorMode: ToneMirrorAnalysis["mentorMode"] = "mentor";
  let adviceType: ToneMirrorAnalysis["adviceType"] = "practical_advice";
  let speedPreference: ToneMirrorAnalysis["speedPreference"] = "steady";

  if (playfulScore > 0 && intenseScore === 0) {
    tone = "warm_friend";
    mentorMode = "friend";
    adviceType = "emotional_support";
    speedPreference = "quick";
  } else if (emotionalIntensity >= 70) {
    tone = "big_brother";
    mentorMode = "friend";
    adviceType = "emotional_support";
    speedPreference = "quick";
  } else if (reflectiveScore > 1) {
    tone = "reflective";
    mentorMode = "mentor";
    adviceType = "deep_reflection";
    speedPreference = "slow";
  } else if (practicalScore > 0 || normalized.includes("how do i")) {
    tone = "practical_coach";
    mentorMode = "coach";
    adviceType = "practical_advice";
    speedPreference = "quick";
  }

  return {
    language,
    tone,
    emotionalIntensity,
    mentorMode,
    adviceType,
    speedPreference,
    reasoning: `Detected ${language}, tone ${tone}, advisory style ${adviceType}, intensity ${emotionalIntensity}.`,
  };
}

export function getToneBadgeLabel(analysis: ToneMirrorAnalysis) {
  const toneMap: Record<ToneStyle, string> = {
    warm_friend: "Warm Friend",
    mentor: "Mentor",
    practical_coach: "Practical Coach",
    big_brother: "Big Brother",
    reflective: "Reflective",
  };

  return toneMap[analysis.tone];
}
