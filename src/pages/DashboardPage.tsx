import { Link } from "react-router";
import { ArrowRight, Receipt, Trophy, Users } from "lucide-react";
import { useLeaderboard, useMyBills, useMyPayments } from "@/api/member";
import { displayName, useAuth } from "@/auth/auth-context";
import { CurrentBillCard } from "@/components/billing/CurrentBillCard";
import { EmptyState, QueryError, Skeleton } from "@/components/feedback/States";
import { PageHeader } from "@/components/layout/PageHeader";
import { LeaderboardList } from "@/components/leaderboard/LeaderboardList";
import { PurchasesList } from "@/components/purchases/PurchasesList";
import { RecordPurchaseButton } from "@/components/purchases/RecordPurchaseButton";
import { currentMonthKey } from "@/lib/dates";
import { formatMonth, formatNaira } from "@/lib/format";

function SectionTitle({ title, to, linkLabel }: { title: string; to: string; linkLabel: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="font-wide text-xl font-extrabold">{title}</h2>
      <Link to={to} className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
        {linkLabel} <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const month = currentMonthKey();
  const bills = useMyBills();
  const payments = useMyPayments();
  const board = useLeaderboard({ type: "month", key: month });

  if (!user) return null;

  return (
    <div className="grid gap-10">
      <PageHeader
        eyebrow="Overview"
        title={`Hi, ${displayName(user)}`}
        description={`Here's where things stand for ${formatMonth(month)}.`}
        actions={<RecordPurchaseButton />}
      />

      {user.role === "ADMIN" && (
        <Link
          to="/admin/users"
          className="group flex items-center gap-4 rounded-2xl bg-volt p-4 text-volt-foreground transition-transform hover:-translate-y-0.5 sm:p-5"
        >
          <Users className="size-5 shrink-0" />
          <span className="flex-1 text-sm">
            <span className="font-semibold">Admin:</span> manage people, monthly amounts and bills
          </span>
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
        </Link>
      )}

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* This month for me */}
        <section className="grid gap-4" aria-label="Your bill">
          {bills.isError ? (
            <QueryError error={bills.error} onRetry={() => void bills.refetch()} />
          ) : bills.isPending ? (
            <Skeleton className="h-52" />
          ) : (
            <CurrentBillCard bill={bills.data.find((b) => b.month === month)} month={month} />
          )}
          <Link to="/bills" className="inline-flex items-center gap-1 justify-self-end text-sm font-medium text-muted-foreground hover:text-foreground">
            All your bills <ArrowRight className="size-4" />
          </Link>
        </section>

        {/* Everyone this month */}
        <section className="grid gap-4" aria-labelledby="board-title">
          <div className="flex items-center justify-between gap-3">
            <h2 id="board-title" className="font-wide text-xl font-extrabold">
              Leaderboard
            </h2>
            <Link to="/leaderboard" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
              Full board <ArrowRight className="size-4" />
            </Link>
          </div>
          {board.isError ? (
            <QueryError error={board.error} onRetry={() => void board.refetch()} />
          ) : board.isPending ? (
            <Skeleton className="h-72" />
          ) : board.data.entries.length === 0 ? (
            <EmptyState icon={Trophy} title="No one has paid this month yet" description="Record a purchase to top the board." />
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {board.data.totals.payers} {board.data.totals.payers === 1 ? "person has" : "people have"} paid{" "}
                <span className="font-mono font-medium text-foreground">{formatNaira(board.data.totals.totalPaid)}</span> in{" "}
                {formatMonth(month)}.
              </p>
              <LeaderboardList entries={board.data.entries.slice(0, 5)} me={board.data.me} sortBy="total" />
            </>
          )}
        </section>
      </div>

      <section className="grid gap-4" aria-label="Recent purchases">
        <SectionTitle title="Recent purchases" to="/purchases" linkLabel="All purchases" />
        {payments.isError ? (
          <QueryError error={payments.error} onRetry={() => void payments.refetch()} />
        ) : payments.isPending ? (
          <Skeleton className="h-40" />
        ) : payments.data.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No purchases yet"
            description="Snap your next token receipt and it'll show up here."
            action={<RecordPurchaseButton />}
          />
        ) : (
          <PurchasesList payments={payments.data} limit={4} />
        )}
      </section>
    </div>
  );
}
