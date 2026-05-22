"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Brain,
  Lock,
  MessageCircleHeart,
  RefreshCw,
  SendHorizontal,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/home/theme-toggle";
import { demoMessages } from "@/lib/mock-data";
import {
  QUICK_EMOTIONAL_STARTERS,
  SMART_PLACEHOLDERS,
  TOPIC_SUGGESTIONS,
} from "@/lib/constants";
import type { ChatMessage, SessionMemory } from "@/lib/types";
import {
  createEmptySessionMemory,
  DEVICE_MEMORY_KEY,
  extractCommonTopics,
  SESSION_MEMORY_KEY,
  summarizeSession,
} from "@/lib/public-session";
import { toast } from "sonner";

type ChatResponse = {
  reply: string;
  selectedModel: string;
  tone: "warm_friend" | "mentor" | "practical_coach" | "big_brother" | "reflective";
  fallbackUsed: boolean;
  analysis: {
    language: "english" | "hindi" | "hinglish" | "mixed";
    tone: "warm_friend" | "mentor" | "practical_coach" | "big_brother" | "reflective";
    emotionalIntensity: number;
  };
};

function createClientId(prefix: string) {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }

  if (globalThis.crypto?.getRandomValues) {
    const bytes = new Uint8Array(16);
    globalThis.crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
    return `${prefix}-${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
  }

  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function createSessionId() {
  return createClientId("mentor");
}

function normalizeToneChip(tone: ChatResponse["analysis"]["tone"]) {
  switch (tone) {
    case "warm_friend":
      return "friend vibe";
    case "practical_coach":
      return "practical advice";
    case "reflective":
      return "deep talk";
    case "big_brother":
      return "mentor vibe";
    default:
      return "mentor vibe";
  }
}

export function InstantCompanion() {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>(demoMessages);
  const [input, setInput] = useState("");
  const [memory, setMemory] = useState<SessionMemory | null>(null);
  const [typing, setTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [fallbackStatus, setFallbackStatus] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = createSessionId();
    const storedDevice = window.localStorage.getItem(DEVICE_MEMORY_KEY);
    const storedSession = window.sessionStorage.getItem(SESSION_MEMORY_KEY);
    const parsed = storedDevice || storedSession;

    if (parsed) {
      const nextMemory = JSON.parse(parsed) as SessionMemory;
      setMemory(nextMemory);
    } else {
      setMemory(createEmptySessionMemory(sessionId));
    }
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPlaceholderIndex((value) => (value + 1) % SMART_PLACEHOLDERS.length);
    }, 2800);

    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!memory) return;
    window.localStorage.removeItem(DEVICE_MEMORY_KEY);
    window.sessionStorage.removeItem(SESSION_MEMORY_KEY);

    if (memory.rememberDevice) {
      window.localStorage.setItem(DEVICE_MEMORY_KEY, JSON.stringify(memory));
    } else {
      window.sessionStorage.setItem(SESSION_MEMORY_KEY, JSON.stringify(memory));
    }
  }, [memory]);

  const toneChips = useMemo(() => {
    const latestAssistant = [...messages].reverse().find((message) => message.role === "assistant");
    if (!latestAssistant) {
      return ["English", "friend vibe"];
    }

    const chips = [
      latestAssistant.language === "hinglish"
        ? "Hinglish"
        : latestAssistant.language === "hindi"
          ? "Hindi"
        : latestAssistant.language === "mixed"
          ? "Mixed"
          : "English",
      normalizeToneChip(latestAssistant.tone),
    ];

    if (latestAssistant.tone === "warm_friend") chips.push("playful");
    if (latestAssistant.tone === "reflective") chips.push("deep talk");

    return Array.from(new Set(chips));
  }, [messages]);

  const hasSavedContext = Boolean(memory?.summary || memory?.commonTopics.length);

  function focusInputWithValue(nextValue: string) {
    setInput(nextValue);
    inputRef.current?.focus();
  }

  function updateMemoryFromConversation(nextMessages: ChatMessage[], response?: ChatResponse) {
    setMemory((current) => {
      const base = current ?? createEmptySessionMemory(createSessionId());
      return {
        ...base,
        preferredLanguage: response?.analysis.language ?? base.preferredLanguage,
        preferredTone: response?.analysis.tone ?? base.preferredTone,
        commonTopics: extractCommonTopics(nextMessages),
        summary: summarizeSession(nextMessages, base.preferredName),
        lastUpdatedAt: new Date().toISOString(),
      };
    });
  }

  function clearMemory() {
    const next = createEmptySessionMemory(createSessionId());
    setMemory(next);
    setMessages(demoMessages);
    window.localStorage.removeItem(DEVICE_MEMORY_KEY);
    window.sessionStorage.removeItem(SESSION_MEMORY_KEY);
    toast.success("Local memory cleared for this device.");
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || !memory) return;

    const userMessage: ChatMessage = {
      id: createClientId("message"),
      role: "user",
      content: trimmed,
      createdAt: "now",
      language: memory.preferredLanguage || "mixed",
      tone: memory.preferredTone || "warm_friend",
    };

    const optimisticMessages = [...messages, userMessage];
    setMessages(optimisticMessages);
    updateMemoryFromConversation(optimisticMessages);
    setInput("");
    setTyping(true);
    setApiError(null);
    setFallbackStatus("Sending...");
    setSelectedModel(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: trimmed,
            sessionId: memory.sessionId,
            preferredName: memory.preferredName || undefined,
            sessionSummary: memory.summary || undefined,
            commonTopics: memory.commonTopics,
            recentMessages: optimisticMessages.slice(-6).map((message) => ({
              role: message.role === "system" ? "assistant" : message.role,
              content: message.content,
            })),
          }),
        });

        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.error ?? "Chat request failed.");
        }

        const result = (await response.json()) as ChatResponse;
        console.log("DEBUG: Frontend received result.reply:", result.reply ? result.reply.substring(0, 100) + "..." : "EMPTY");
        const assistantMessage: ChatMessage = {
          id: createClientId("message"),
          role: "assistant",
          content: result.reply,
          createdAt: "now",
          language: result.analysis.language,
          tone: result.analysis.tone,
        };

        const nextMessages = [...optimisticMessages, assistantMessage];
        setMessages(nextMessages);
        setSelectedModel(result.selectedModel);
        setFallbackStatus(result.fallbackUsed ? "Used fallback model" : "Primary model" );
        updateMemoryFromConversation(nextMessages, result);
      } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : "Unknown error";
        setApiError(message);
        setFallbackStatus("Retrying may help if the network is unstable.");
        toast.error("Couldn't reach Friend AI just now. Try again in a moment.");
      } finally {
        setTyping(false);
      }
    });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-36 pt-4 sm:px-6 lg:px-8">
      <header className="mb-10 flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-glow">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">Friend AI</p>
            <p className="text-sm text-muted-foreground">Anonymous companion mode</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="secondary" size="sm" onClick={() => inputRef.current?.focus()}>
            <MessageCircleHeart className="h-4 w-4" />
            Talk now
          </Button>
        </div>
      </header>

      <section className="mx-auto w-full max-w-4xl text-center">
        {apiError ? (
          <div className="mx-auto mb-6 max-w-3xl rounded-3xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <strong className="font-semibold">Connection issue:</strong> {apiError}
          </div>
        ) : selectedModel ? (
          <div className="mx-auto mb-6 flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="uppercase tracking-[0.18em]">
              {selectedModel}
            </Badge>
            {fallbackStatus ? (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                {fallbackStatus}
              </Badge>
            ) : null}
          </div>
        ) : null}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl"
        >
          A friend who understands your real life.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground"
        >
          Talk in English or Hinglish. No login. No pressure. Just real conversations.
        </motion.p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {toneChips.map((chip) => (
            <Badge key={chip} variant="primary" className="capitalize">
              {chip}
            </Badge>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 grid w-full max-w-5xl gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-base font-semibold">Instant conversation</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Start with whatever feels easiest. You don&apos;t need the perfect words.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              Privacy-first local memory
            </div>
          </div>

          <div className="mt-5 rounded-[30px] border border-white/10 bg-white/5 p-4 sm:p-5">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[90%] rounded-[28px] px-4 py-3 text-[15px] leading-7 sm:max-w-[82%] sm:px-5 ${
                      message.role === "user"
                        ? "bg-white/8 text-foreground"
                        : "border border-primary/15 bg-primary/10 text-foreground"
                    }`}
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {typing ? (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-[28px] border border-primary/15 bg-primary/10 px-4 py-3 text-sm text-muted-foreground">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:120ms]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:240ms]" />
                  listening carefully...
                </div>
              </div>
            ) : null}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">Recent emotional starters</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {QUICK_EMOTIONAL_STARTERS.map((starter) => (
                <button
                  key={starter}
                  onClick={() => focusInputWithValue(`I need help with ${starter}.`)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm capitalize text-muted-foreground transition hover:border-primary/20 hover:bg-white/8 hover:text-foreground"
                >
                  {starter}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-semibold">Try a real topic</p>
            <div className="mt-4 space-y-3">
              {TOPIC_SUGGESTIONS.map((topic) => (
                <button
                  key={topic.title}
                  onClick={() => focusInputWithValue(topic.prompt)}
                  className="w-full rounded-3xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/8"
                >
                  <p className="font-medium">{topic.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{topic.prompt}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Remember this device</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Keep your recent tone, topics, and session summary locally in this browser.
                </p>
              </div>
              <Switch
                checked={memory?.rememberDevice ?? true}
                onCheckedChange={(checked) =>
                  setMemory((current) =>
                    current ? { ...current, rememberDevice: checked } : current,
                  )
                }
                aria-label="Remember this device"
              />
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground">
              {hasSavedContext ? (
                <>
                  <p className="font-medium text-foreground">Memory continuation is on.</p>
                  <p className="mt-2 leading-6">
                    I’ll keep this browser’s recent emotional context locally so you can continue without starting from zero.
                  </p>
                </>
              ) : (
                <p className="leading-6">
                  Nothing sensitive leaves your browser as stored memory here. You can clear local context anytime.
                </p>
              )}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <Button variant="secondary" size="sm" onClick={() => inputRef.current?.focus()}>
                <RefreshCw className="h-4 w-4" />
                Resume talking
              </Button>
              <Button variant="ghost" size="sm" onClick={clearMemory}>
                <Trash2 className="h-4 w-4" />
                Clear all memory
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <footer className="mx-auto mt-14 w-full max-w-5xl text-center text-sm text-muted-foreground">
        Built for instant emotional comfort. No login. No pressure. Just a cleaner place to talk.
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/85 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              value={memory?.preferredName ?? ""}
              onChange={(event) =>
                setMemory((current) =>
                  current ? { ...current, preferredName: event.target.value.slice(0, 40) } : current,
                )
              }
              className="sm:max-w-[220px]"
              placeholder="Optional name"
              aria-label="Optional name"
            />
            <p className="text-sm text-muted-foreground">
              What&apos;s on your mind today?
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-3 shadow-soft">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
                  event.preventDefault();
                  inputRef.current?.focus();
                }
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }}
              placeholder={SMART_PLACEHOLDERS[placeholderIndex]}
              className="min-h-[90px] border-0 bg-transparent p-3 text-base focus-visible:ring-0"
              aria-label="Chat input"
            />
            <div className="flex items-center justify-between gap-3 px-3 pb-2">
              <p className="text-xs text-muted-foreground">
                Press `Enter` to send, `Shift + Enter` for a new line, `Ctrl/Cmd + K` to refocus.
              </p>
              <Button onClick={handleSend} disabled={isPending || !memory}>
                <SendHorizontal className="h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
