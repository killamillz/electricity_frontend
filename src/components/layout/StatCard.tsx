import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  /** Small text under the value */
  note?: ReactNode;
  /** "dark" for the one figure that matters most on a page */
  tone?: "light" | "dark";
};

export function StatCard({ label, value, icon: Icon, note, tone = "light" }: StatCardProps) {
  const dark = tone === "dark";

  return (
    <div className={cn("rounded-2xl p-5 ring-1", dark ? "bg-ink text-paper ring-ink" : "bg-card ring-border")}>
      <div className="flex items-center justify-between gap-3">
        <p className={cn("text-sm", dark ? "text-paper/60" : "text-muted-foreground")}>{label}</p>
        <Icon className={cn("size-4", dark ? "text-volt" : "text-muted-foreground")} />
      </div>
      <p className="mt-3 font-wide text-2xl font-black tabular-nums sm:text-3xl">{value}</p>
      {note && <p className={cn("mt-1 text-xs", dark ? "text-paper/50" : "text-muted-foreground")}>{note}</p>}
    </div>
  );
}
