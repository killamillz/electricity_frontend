import { useState } from "react";
import { Banknote, Plus, Trophy, Users, Zap } from "lucide-react";
import { useLeaderboard, type LeaderboardPeriod, type LeaderboardSort } from "@/api/member";
import { EmptyState, QueryError, Skeleton } from "@/components/feedback/States";
import { SegmentedControl } from "@/components/form/SegmentedControl";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { LeaderboardList } from "@/components/leaderboard/LeaderboardList";
import { PeriodPicker } from "@/components/leaderboard/PeriodPicker";
import { Podium } from "@/components/leaderboard/Podium";
import { RecordPurchaseButton } from "@/components/purchases/RecordPurchaseButton";
import { currentMonthKey } from "@/lib/dates";
import { formatMonth, formatNaira } from "@/lib/format";

const periodTypes = [
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
] as const;

const sorts = [
  { value: "total", label: "Total paid" },
  { value: "extra", label: "Extra paid" },
] as const;

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<LeaderboardPeriod>({ type: "month", key: currentMonthKey() });
  const [sortBy, setSortBy] = useState<LeaderboardSort>("total");
  const board = useLeaderboard(period, sortBy);
  const periodLabel = period.type === "month" ? formatMonth(period.key) : period.key;

  const changeType = (type: LeaderboardPeriod["type"]) =>
    setPeriod({ type, key: type === "month" ? currentMonthKey() : currentMonthKey().slice(0, 4) });

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Leaderboard"
        title="Who's paid what"
        description="Everyone who bought electricity in the period, ranked. Only names and amounts are shown."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PeriodPicker period={period} onChange={setPeriod} />
        <div className="flex flex-wrap gap-2">
          <SegmentedControl label="Period" options={periodTypes} value={period.type} onChange={changeType} />
          <SegmentedControl label="Rank by" options={sorts} value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {board.isError ? (
        <QueryError error={board.error} onRetry={() => void board.refetch()} />
      ) : board.isPending ? (
        <div className="grid gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-64" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Paid by everyone" value={formatNaira(board.data.totals.totalPaid)} icon={Banknote} tone="dark" />
            <StatCard label="Toward bills" value={formatNaira(board.data.totals.billPaid)} icon={Zap} />
            <StatCard label="Extra" value={formatNaira(board.data.totals.extraPaid)} icon={Plus} />
            <StatCard label="People who paid" value={board.data.totals.payers} icon={Users} />
          </div>

          {board.data.entries.length === 0 ? (
            <EmptyState
              icon={Trophy}
              title={`No purchases in ${periodLabel}`}
              description="Be the first on the board."
              action={<RecordPurchaseButton />}
            />
          ) : (
            <div className="grid items-start gap-6 lg:grid-cols-[2fr_3fr]">
              <div className="grid gap-4">
                <Podium entries={board.data.entries.slice(0, 3)} sortBy={sortBy} />
                <div className="rounded-2xl bg-card p-5 ring-1 ring-border">
                  {board.data.me ? (
                    <>
                      <p className="text-sm text-muted-foreground">Your place in {periodLabel}</p>
                      <p className="mt-1 font-wide text-3xl font-black">
                        #{board.data.me.rank}{" "}
                        <span className="text-lg text-muted-foreground">of {board.data.totals.payers}</span>
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium">You're not on the board for {periodLabel}</p>
                      <p className="mt-1 text-sm text-muted-foreground">Record a purchase to join in.</p>
                      <RecordPurchaseButton size="lg" className="mt-4" />
                    </>
                  )}
                </div>
              </div>
              <LeaderboardList entries={board.data.entries} me={board.data.me} sortBy={sortBy} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
