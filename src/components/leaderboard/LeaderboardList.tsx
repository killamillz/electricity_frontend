import { useRef } from "react";
import type { LeaderboardEntry, LeaderboardSort } from "@/api/member";
import { formatNaira } from "@/lib/format";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { entryAmount, nameInitials } from "./utils";

type RowProps = { entry: LeaderboardEntry; sortBy: LeaderboardSort; max: number };

function Row({ entry, sortBy, max }: RowProps) {
  const amount = entryAmount(entry, sortBy);

  return (
    <li
      className={cn(
        "grid grid-cols-[2rem_auto_1fr_auto] items-center gap-3 px-4 py-3 sm:gap-4",
        entry.isMe && "bg-volt/20",
      )}
    >
      <span className="text-center font-mono text-sm text-muted-foreground tabular-nums">{entry.rank}</span>
      <span
        className={cn(
          "grid size-9 place-items-center rounded-full font-wide text-xs font-bold",
          entry.isMe ? "bg-volt text-volt-foreground" : "bg-ink text-paper",
        )}
        aria-hidden
      >
        {nameInitials(entry.name)}
      </span>
      <div className="min-w-0">
        <p className="truncate font-medium">
          {entry.name}
          {entry.isMe && <span className="ml-2 text-xs font-semibold text-muted-foreground">(you)</span>}
        </p>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            data-bar
            className={cn("h-full origin-left rounded-full", entry.isMe ? "bg-ink" : "bg-ink/70")}
            style={{ width: `${max > 0 ? (amount / max) * 100 : 0}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatNaira(entry.billPaid)} bill · {formatNaira(entry.extraPaid)} extra · {entry.payments}{" "}
          {entry.payments === 1 ? "purchase" : "purchases"}
        </p>
      </div>
      <span className="font-mono font-medium tabular-nums">{formatNaira(amount)}</span>
    </li>
  );
}

type LeaderboardListProps = {
  entries: LeaderboardEntry[];
  /** The user's own row, shown at the bottom if it isn't in `entries` */
  me?: LeaderboardEntry | null;
  sortBy: LeaderboardSort;
  className?: string;
};

/** Ranked rows with a bar for each person's share, relative to the top payer */
export function LeaderboardList({ entries, me, sortBy, className }: LeaderboardListProps) {
  const scope = useRef<HTMLDivElement>(null);
  const max = Math.max(0, ...entries.map((e) => entryAmount(e, sortBy)), me ? entryAmount(me, sortBy) : 0);
  const showMeSeparately = me && !entries.some((e) => e.isMe);

  // Bars grow in whenever the list changes (new period or sort)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from("[data-bar]", { scaleX: 0, duration: 0.8, ease: "power3.out", stagger: 0.04 });
      });
    },
    { scope, dependencies: [entries, sortBy], revertOnUpdate: true },
  );

  return (
    <div ref={scope} className={cn("overflow-hidden rounded-2xl bg-card ring-1 ring-border", className)}>
      <ol className="divide-y divide-border">
        {entries.map((entry) => (
          <Row key={`${entry.rank}-${entry.name}`} entry={entry} sortBy={sortBy} max={max} />
        ))}
      </ol>
      {showMeSeparately && (
        <ol className="border-t-2 border-dashed border-border">
          <Row entry={me} sortBy={sortBy} max={max} />
        </ol>
      )}
    </div>
  );
}
