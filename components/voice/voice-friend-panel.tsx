"use client";

import { useState } from "react";
import { Mic, Pause, Play, Radio, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function VoiceFriendPanel() {
  const [active, setActive] = useState(false);

  return (
    <Card className="overflow-hidden p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-lg font-semibold">Voice friend mode</p>
          <p className="mt-1 text-sm text-muted-foreground">Talk out loud when typing feels too heavy.</p>
        </div>
        <Badge variant="primary">Live transcript ready</Badge>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <button
          aria-label="Toggle microphone"
          onClick={() => setActive((value) => !value)}
          className="relative flex h-28 w-28 items-center justify-center rounded-full border border-primary/20 bg-primary/10 shadow-glow transition hover:scale-[1.02]"
        >
          <div className={`absolute inset-0 rounded-full ${active ? "animate-ping bg-primary/20" : ""}`} />
          <Mic className="relative h-10 w-10 text-primary" />
        </button>

        <div className="mt-8 flex w-full max-w-xl items-end justify-center gap-2">
          {[28, 36, 52, 40, 64, 46, 32, 55, 42, 24].map((height, index) => (
            <div
              key={index}
              className={`w-3 rounded-full bg-gradient-to-t from-primary to-accent ${active ? "animate-pulse" : ""}`}
              style={{ height }}
            />
          ))}
        </div>

        <div className="mt-8 grid w-full gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Radio className="h-4 w-4 text-primary" />
              Live transcript
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              “I know I’m overthinking this, but I can’t switch my mind off tonight and I just want someone to help me think clearly...”
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Play className="h-4 w-4 text-accent" />
              AI speaking state
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Calm reply playback with replay controls, transcript save, and session continuity into memory.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="secondary">
            <Play className="h-4 w-4" />
            Replay
          </Button>
          <Button variant="secondary">
            <Pause className="h-4 w-4" />
            Pause
          </Button>
          <Button>
            <Save className="h-4 w-4" />
            Save transcript
          </Button>
        </div>
      </div>
    </Card>
  );
}
