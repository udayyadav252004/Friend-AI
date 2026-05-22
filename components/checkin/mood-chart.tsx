"use client";

import { Card } from "@/components/ui/card";

export function MoodChart() {
  return (
    <Card className="p-5">
      <div className="mb-5">
        <p className="text-lg font-semibold">Weekly emotional trend</p>
        <p className="text-sm text-muted-foreground">The public experience now focuses on instant conversation over dashboard analytics.</p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-muted-foreground">
        Friend AI now opens directly into conversation. Memory and continuity happen privately in the browser, without charts, accounts, or setup friction.
      </div>
    </Card>
  );
}
