import Link from "next/link";
import { Search, Sparkles, Flame, BrainCircuit, Mic2, Shield } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type AppShellProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  rightRail?: React.ReactNode;
};

const icons: Record<string, React.ReactNode> = {
  Chat: <Sparkles className="h-4 w-4" />,
  "Check-in": <Flame className="h-4 w-4" />,
  Memory: <BrainCircuit className="h-4 w-4" />,
  "Reply Assist": <Shield className="h-4 w-4" />,
  Voice: <Mic2 className="h-4 w-4" />,
};

export function AppShell({ children, title, subtitle, rightRail }: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 p-4 lg:p-6">
      <aside className="hidden w-72 shrink-0 flex-col gap-4 lg:flex">
        <Card className="p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-glow">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Friend AI</p>
              <p className="text-sm text-muted-foreground">Emotionally intelligent life mentor</p>
            </div>
          </div>
          <div className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn("flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground")}
              >
                {icons[item.label]}
                {item.label}
              </Link>
            ))}
          </div>
        </Card>
        <Card className="space-y-4 p-5">
          <div>
            <p className="text-sm font-semibold">Mood streak</p>
            <p className="mt-1 text-sm text-muted-foreground">7-day emotional check-in streak.</p>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
            <div>
              <p className="text-3xl font-semibold">07</p>
              <p className="text-xs text-muted-foreground">days steady</p>
            </div>
            <Badge variant="success">+18% calmer</Badge>
          </div>
        </Card>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col gap-6">
        <Card className="p-4 md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[220px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search history, memories, tools..." />
              </div>
              <Badge variant="primary">Tone Mirror Active</Badge>
              <Badge variant="accent">Hinglish ready</Badge>
            </div>
          </div>
        </Card>
        <div className={cn("grid gap-6", rightRail ? "xl:grid-cols-[minmax(0,1fr)_340px]" : "")}>
          <div className="min-w-0">{children}</div>
          {rightRail ? <div className="space-y-6">{rightRail}</div> : null}
        </div>
      </main>
    </div>
  );
}
