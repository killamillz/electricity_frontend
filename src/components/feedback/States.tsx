import type { ReactNode } from "react";
import { CircleAlert, type LucideIcon } from "lucide-react";
import { errorMessage } from "@/api/errors";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Grey placeholder block shown while data loads */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-muted", className)} aria-hidden />;
}

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

/** Shown when a list has nothing in it */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("rounded-3xl border border-dashed border-border px-6 py-14 text-center", className)}>
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-4 font-wide text-lg font-bold">{title}</h3>
      {description && <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/** Shown when a request fails, with a retry button */
export function QueryError({ error, onRetry, className }: { error: unknown; onRetry: () => void; className?: string }) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-start gap-4 rounded-2xl border border-late/30 bg-late/8 p-5 sm:flex-row sm:items-center",
        className,
      )}
    >
      <CircleAlert className="size-5 shrink-0 text-late" />
      <p className="flex-1 text-sm text-late">{errorMessage(error)}</p>
      <Button variant="outline" size="lg" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
