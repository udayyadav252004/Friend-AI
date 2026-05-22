"use client";

import { useMemo, useState, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Download, Pin, Send, Share2, Sparkles } from "lucide-react";
import { demoMessages } from "@/lib/mock-data";
import { QUICK_PROMPTS } from "@/lib/constants";
import { sendChatMessageAction } from "@/actions/chat";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ChatWindow() {
  const [messages, setMessages] = useState(demoMessages);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const toneBadge = useMemo(() => messages[messages.length - 1]?.tone ?? "mentor", [messages]);
  const languageBadge = useMemo(() => messages[messages.length - 1]?.language ?? "english", [messages]);

  function handleQuickPrompt(prompt: string) {
    setInput(prompt);
  }

  function handleSubmit() {
    if (!input.trim()) return;

    const optimisticMessage = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content: input,
      createdAt: "now",
      language: "mixed" as const,
      tone: "warm_friend" as const,
    };

    setMessages((current) => [...current, optimisticMessage]);
    const currentInput = input;
    setInput("");

    startTransition(async () => {
      const formData = new FormData();
      formData.append("message", currentInput);
      const result = await sendChatMessageAction(formData);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: result.reply,
          createdAt: "now",
          language: result.analysis.language,
          tone: result.analysis.tone,
        },
      ]);
    });
  }

  return (
    <Card className="flex min-h-[78vh] flex-col overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-5">
        <div>
          <p className="text-lg font-semibold">Main mentor dashboard</p>
          <p className="text-sm text-muted-foreground">Human-feeling chat with continuity, memory, and practical support.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">{toneBadge}</Badge>
          <Badge variant="accent">{languageBadge}</Badge>
          <Button variant="ghost" size="icon" aria-label="Pin conversation">
            <Pin className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Copy conversation">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Share conversation">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Export conversation">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleQuickPrompt(prompt)}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground transition hover:border-primary/20 hover:text-foreground"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1 px-5">
        <div className="space-y-6 py-6">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}>
              {message.role !== "user" ? (
                <Avatar className="mt-1 h-10 w-10 border border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              ) : null}
              <div
                className={cn(
                  "max-w-3xl rounded-[28px] border px-5 py-4 text-sm leading-7",
                  message.role === "user" ? "border-white/10 bg-white/6" : "border-primary/20 bg-primary/10",
                )}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          {isPending ? (
            <div className="flex gap-3">
              <Avatar className="mt-1 h-10 w-10 border border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2 rounded-[28px] border border-primary/20 bg-primary/10 px-5 py-4 text-sm text-muted-foreground">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:300ms]" />
                thinking with emotional context...
              </div>
            </div>
          ) : null}
        </div>
      </ScrollArea>

      <div className="border-t border-white/10 p-5">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-3">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="What’s really on your mind today?"
            className="min-h-[120px] border-0 bg-transparent p-3 focus-visible:ring-0"
          />
          <div className="flex items-center justify-between gap-3 px-3 pb-3">
            <p className="text-xs text-muted-foreground">Emotional validation first. Practical advice second. Never robotic.</p>
            <Button onClick={handleSubmit} disabled={isPending}>
              Send
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
