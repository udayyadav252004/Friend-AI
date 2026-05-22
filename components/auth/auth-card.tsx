"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AuthCard() {
  return (
    <Card className="mx-auto max-w-2xl p-8">
      <ShieldCheck className="h-10 w-10 text-emerald-300" />
      <h1 className="mt-6 text-3xl font-semibold">Friend AI is now open instantly.</h1>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        No login, signup, or onboarding is required anymore. You can start talking right away from the homepage.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Go to the conversation
        </Link>
      </Button>
    </Card>
  );
}
