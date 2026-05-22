"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Card className="max-w-xl p-8 text-center">
        <h2 className="text-3xl font-semibold">Something broke the calm.</h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          The app hit an unexpected issue. Your data is safe, and you can retry the page now.
        </p>
        <Button className="mt-6" onClick={() => reset()}>
          Try again
        </Button>
      </Card>
    </div>
  );
}
