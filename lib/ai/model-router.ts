import { ToneMirrorAnalysis } from "./tone-mirror";

export const OPENROUTER_FREE_MODELS = {
  llama: "openai/gpt-3.5-turbo",
  mistral: "openai/gpt-4",
  gemma: "anthropic/claude-3-haiku",
  phi: "anthropic/claude-3-sonnet",
} as const;

const emotionalKeywords = [
  "breakup",
  "anxiety",
  "panic",
  "sad",
  "heartbroken",
  "lonely",
  "depressed",
  "scared",
  "stuck",
  "nervous",
  "failed",
  "overthinking",
  "pressure",
  "guilt",
  "hurt",
];

const practicalKeywords = [
  "study",
  "exam",
  "interview",
  "career",
  "job",
  "placement",
  "work",
  "plan",
  "goal",
  "project",
  "strategy",
  "deadline",
  "resume",
  "college",
  "application",
  "future",
];

const hinglishKeywords = [
  "yaar",
  "bhai",
  "kya",
  "nahi",
  "acha",
  "samajh",
  "kar raha",
  "scene",
  "dekh",
  "tum",
  "hain",
  "hum",
  "bol",
  "difficult",
];

const fallbackChain = [
  OPENROUTER_FREE_MODELS.llama,
  OPENROUTER_FREE_MODELS.mistral,
  OPENROUTER_FREE_MODELS.gemma,
  OPENROUTER_FREE_MODELS.phi,
];

function containsAny(message: string, terms: string[]) {
  const normalized = message.toLowerCase();
  return terms.some((term) => normalized.includes(term));
}

export function selectBestModel(message: string, analysis: ToneMirrorAnalysis) {
  const normalized = message.toLowerCase();
  const emotionalIntent =
    analysis.emotionalIntensity >= 55 || containsAny(normalized, emotionalKeywords);
  const practicalIntent =
    analysis.mentorMode === "coach" || containsAny(normalized, practicalKeywords);
  const hinglishIntent =
    analysis.language !== "english" || containsAny(normalized, hinglishKeywords);

  if (emotionalIntent) {
    return OPENROUTER_FREE_MODELS.llama;
  }

  if (practicalIntent) {
    return OPENROUTER_FREE_MODELS.mistral;
  }

  if (hinglishIntent) {
    return OPENROUTER_FREE_MODELS.gemma;
  }

  if (analysis.tone === "reflective") {
    return OPENROUTER_FREE_MODELS.gemma;
  }

  return OPENROUTER_FREE_MODELS.mistral;
}

export function getFallbackModels(primary: string) {
  return fallbackChain.filter((model) => model !== primary);
}

export function resolveModelLabel(model: string) {
  return model.split(":")[0];
}
