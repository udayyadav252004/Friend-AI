"use client";

import { useState, useTransition } from "react";
import { replyAssistAction } from "@/actions/chat";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function ReplyAssistForm() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<null | Record<string, string>>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("input", input);
      const response = await replyAssistAction(formData);

      if (!response.success) {
        toast.error(response.error);
        return;
      }

      if (response.variants) {
        setResult(response.variants);
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <p className="text-lg font-semibold">Paste chat text</p>
        <p className="mt-2 text-sm text-muted-foreground">Get mature, soft, confident, emotionally intelligent, or no-reply suggestions.</p>
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Paste the conversation here..."
          className="mt-5 min-h-[180px]"
        />
        <Button onClick={handleSubmit} className="mt-4" disabled={isPending}>
          Generate replies
        </Button>
      </Card>

      {result ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(result).map(([key, value]) => (
            <Card key={key} className="p-5">
              <Badge variant={key === "redFlagWarning" ? "accent" : "primary"} className="capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </Badge>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{value}</p>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
