"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Headphones, MessageCircleHeart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const previewMessages = [
  {
    role: "user",
    content: "bro dimag kharab ho raha hai",
  },
  {
    role: "assistant",
    content: "Sun, pehle breathe. Tera brain overload mode mein hai, failure mode mein nahi.",
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-12 md:pt-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative z-10">
          <Badge variant="primary" className="mb-5 w-fit">
            Emotionally intelligent AI for real life
          </Badge>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl text-balance text-5xl font-semibold leading-tight md:text-7xl"
          >
            Not just AI. A friend who understands your real life.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground"
          >
            Talk in English or Hinglish. Get advice that feels human, practical, and emotionally real.
          </motion.p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/auth">
                Start Talking
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/chat">Try Demo</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/chat">Talk in Hinglish</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MessageCircleHeart className="h-4 w-4 text-primary" />
              Tone mirroring that feels natural
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="h-4 w-4 text-accent" />
              Voice mode for late-night overwhelm
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative"
        >
          <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
          <Card className="relative overflow-hidden border-white/15 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Live demo conversation</p>
                <p className="text-lg font-semibold">Interview panic support</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-4">
              {previewMessages.map((message, index) => (
                <motion.div
                  key={message.role}
                  initial={{ opacity: 0, x: index === 0 ? 18 : -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                  className={`max-w-[88%] rounded-3xl border px-4 py-3 text-sm leading-7 ${
                    message.role === "user"
                      ? "ml-auto border-white/10 bg-white/6"
                      : "border-primary/20 bg-primary/10"
                  }`}
                >
                  {message.content}
                </motion.div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Tone</p>
                <p className="mt-2 text-sm font-medium">Warm Hinglish + grounded advice</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Memory</p>
                <p className="mt-2 text-sm font-medium">Remembers placement stress triggers</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
