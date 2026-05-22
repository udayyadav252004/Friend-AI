import { Skeleton } from "@/components/ui/skeleton";

export default function GlobalLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-6 py-10">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-[420px] w-full" />
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
