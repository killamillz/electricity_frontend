import { ChevronLeft, ChevronRight } from "lucide-react";
import type { LeaderboardPeriod } from "@/api/member";
import { Button } from "@/components/ui/button";
import { currentMonthKey, shiftMonth } from "@/lib/dates";
import { formatMonth } from "@/lib/format";

/** "‹ October 2026 ›": step back through past months or years */
export function PeriodPicker({ period, onChange }: { period: LeaderboardPeriod; onChange: (p: LeaderboardPeriod) => void }) {
  const current = period.type === "month" ? currentMonthKey() : currentMonthKey().slice(0, 4);
  const shift = (by: number) =>
    onChange({
      ...period,
      key: period.type === "month" ? shiftMonth(period.key, by) : String(Number(period.key) + by),
    });

  return (
    <div className="flex items-center gap-1">
      <Button variant="outline" size="icon-lg" onClick={() => shift(-1)} aria-label={`Previous ${period.type}`}>
        <ChevronLeft />
      </Button>
      <span className="min-w-36 text-center font-wide font-bold" aria-live="polite">
        {period.type === "month" ? formatMonth(period.key) : period.key}
      </span>
      <Button
        variant="outline"
        size="icon-lg"
        onClick={() => shift(1)}
        disabled={period.key >= current}
        aria-label={`Next ${period.type}`}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
