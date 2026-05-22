import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-white/10 bg-white/5 text-foreground",
        primary: "border-primary/20 bg-primary/15 text-primary",
        secondary: "border-white/10 bg-white/8 text-foreground",
        outline: "border-white/10 bg-transparent text-foreground",
        accent: "border-accent/20 bg-accent/15 text-accent",
        success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
