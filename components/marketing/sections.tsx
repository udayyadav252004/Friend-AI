import { BrainCircuit, HeartPulse, Languages, ShieldCheck, Sparkles, TrendingUp, WandSparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Languages,
    title: "Tone mirroring that feels human",
    description: "Friend AI adapts to English, Hinglish, mixed language, and your emotional intensity without sounding fake.",
  },
  {
    icon: BrainCircuit,
    title: "Memory that builds real continuity",
    description: "Recurring triggers, breakthroughs, habits, and relationship patterns stay organized so advice gets sharper over time.",
  },
  {
    icon: HeartPulse,
    title: "Daily emotional check-ins",
    description: "Track stress, confidence, focus, sleep, overthinking, relationship energy, and academic pressure with trend insights.",
  },
];

const testimonials = [
  {
    quote:
      "It feels like texting that one emotionally mature friend who actually gets both my panic and my ambition.",
    name: "Rhea, final-year student",
  },
  {
    quote:
      "The Hinglish tone mirroring is wild. It sounds warm, not try-hard. And the advice is actually usable.",
    name: "Kabir, analyst",
  },
  {
    quote:
      "Reply Assist saved me from sending three emotionally embarrassing texts in one week.",
    name: "Simran, MBA aspirant",
  },
];

const faqs = [
  {
    question: "Is Friend AI a therapist?",
    answer:
      "No. It is an emotionally intelligent AI companion and practical mentor. It supports reflection, planning, and grounded guidance, while encouraging real-world support when needed.",
  },
  {
    question: "Can I talk in Hinglish?",
    answer:
      "Yes. The Tone Mirror Engine adapts across English, Hinglish, and mixed-language conversations naturally.",
  },
  {
    question: "Does it remember me?",
    answer:
      "Yes, with editable memory controls. You can pin, edit, hide, or delete memory at any time from the Memory Center.",
  },
];

export function FeatureSections() {
  return (
    <div className="space-y-24 pb-24">
      <section id="features" className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-2xl">
          <Badge variant="accent">Why it feels different</Badge>
          <h2 className="mt-4 text-3xl font-semibold md:text-5xl">Built to understand your real emotional context, not just your words.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6">
              <feature.icon className="h-10 w-10 text-primary" />
              <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-7">
            <div className="flex items-center gap-3">
              <WandSparkles className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">Tone Mirroring Showcase</h3>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-muted-foreground">Input</p>
                <p className="mt-2 text-lg">“bro dimag kharab ho raha hai”</p>
                <p className="mt-4 text-sm text-primary">Output</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  “Sun, pehle thoda breathe kar. Tu breakdown nahi, overload feel kar raha hai. Abhi ek kaam karte hain...”
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-muted-foreground">Input</p>
                <p className="mt-2 text-lg">“I feel anxious before interviews”</p>
                <p className="mt-4 text-sm text-primary">Output</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  “That makes sense. Interview anxiety usually comes from threat anticipation, not inability. Let’s reduce uncertainty with one practical rehearsal loop.”
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-7">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-accent" />
              <h3 className="text-xl font-semibold">Memory + Check-in Continuity</h3>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-medium">Memory timeline</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Tracks recurring fears, relationship themes, placement stress, and recent wins so each conversation starts deeper than the last one.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-medium">Daily check-in insights</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Spots patterns like “sleep down, overthinking up” or “placement day causes anxiety spikes” and surfaces grounded action before spirals grow.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-7">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-300" />
              <h3 className="text-xl font-semibold">Emotionally safe, practically useful</h3>
            </div>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              Friend AI validates emotion without making users dependent. It nudges toward real-world action, better conversations, calmer decisions, and healthy offline support.
            </p>
            <Button className="mt-6">Start Talking</Button>
          </Card>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.name} className="p-6">
                <Sparkles className="h-5 w-5 text-primary" />
                <p className="mt-4 text-sm leading-7 text-muted-foreground">“{item.quote}”</p>
                <p className="mt-6 text-sm font-medium">{item.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-7">
            <p className="text-sm text-muted-foreground">Starter</p>
            <p className="mt-4 text-4xl font-semibold">Free</p>
            <p className="mt-3 text-sm text-muted-foreground">Daily check-ins, guided chat, basic memory.</p>
          </Card>
          <Card className="border-primary/20 p-7 shadow-glow">
            <Badge variant="primary" className="w-fit">Most loved</Badge>
            <p className="mt-4 text-sm text-muted-foreground">Premium</p>
            <p className="mt-4 text-4xl font-semibold">Rs 799/mo</p>
            <p className="mt-3 text-sm text-muted-foreground">Unlimited chat, voice mode, deeper memory, reply assist, emotional analytics, premium personalities.</p>
          </Card>
          <Card className="p-7">
            <p className="text-sm text-muted-foreground">Teams / Campus</p>
            <p className="mt-4 text-4xl font-semibold">Custom</p>
            <p className="mt-3 text-sm text-muted-foreground">Campus wellness, employee support, analytics dashboards, and privacy controls.</p>
          </Card>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-4xl px-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">FAQ</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.question} className="p-6">
              <h3 className="text-lg font-semibold">{faq.question}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-7xl border-t border-white/10 px-6 py-8 text-sm text-muted-foreground">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p>Friend AI. Premium emotional intelligence for real life.</p>
          <div className="flex gap-4">
            <a href="/settings">Privacy</a>
            <a href="/auth">Login</a>
            <a href="/admin">Admin</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
