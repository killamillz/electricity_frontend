import { useState } from "react";
import { Link, useParams } from "react-router";
import { AlarmClock, ArrowLeft, Banknote, CalendarCheck, CalendarRange, UserX, Wallet } from "lucide-react";
import { useAdminUserBills, useAdminUsers } from "@/api/admin";
import { fullName } from "@/auth/auth-context";
import { MonthlyAmountDialog } from "@/components/admin/MonthlyAmountDialog";
import { BillsList } from "@/components/billing/BillsList";
import { EmptyState, QueryError, Skeleton } from "@/components/feedback/States";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { Button } from "@/components/ui/button";
import { formatDate, formatNaira } from "@/lib/format";

/** One person: their monthly amount and every bill */
export default function AdminUserPage() {
  const { id = "" } = useParams();
  const users = useAdminUsers();
  const bills = useAdminUserBills(id);
  const [editing, setEditing] = useState(false);

  const backLink = (
    <Link to="/admin/users" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
      <ArrowLeft className="size-4" /> All people
    </Link>
  );

  if (users.isError) return <QueryError error={users.error} onRetry={() => void users.refetch()} />;
  if (users.isPending) {
    return (
      <div className="grid gap-8">
        {backLink}
        <Skeleton className="h-20 w-2/3" />
        <Skeleton className="h-72" />
      </div>
    );
  }

  const user = users.data.find((u) => u.id === id);
  if (!user) {
    return (
      <div className="grid gap-8">
        {backLink}
        <EmptyState icon={UserX} title="Person not found" description="They may have been removed, or the link is wrong." />
      </div>
    );
  }

  const hasPlan = user.monthlyAmount !== null;
  const list = bills.data ?? [];
  const owed = list.filter((b) => b.status !== "PAID").reduce((sum, b) => sum + b.remaining, 0);
  const paidCount = list.filter((b) => b.status === "PAID").length;
  const lateCount = list.filter((b) => b.status === "LATE").length;

  return (
    <div className="grid gap-8">
      {backLink}

      <PageHeader
        eyebrow={user.role === "ADMIN" ? "Admin · Person" : "Person"}
        title={fullName(user)}
        description={`${user.email} · joined ${formatDate(user.createdAt)}`}
        actions={
          <Button size="lg" variant={hasPlan ? "outline" : "default"} onClick={() => setEditing(true)}>
            <Banknote />
            {hasPlan ? "Change monthly amount" : "Set monthly amount"}
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Monthly amount"
          value={hasPlan ? formatNaira(user.monthlyAmount ?? 0) : "No plan"}
          icon={Wallet}
          tone="dark"
        />
        <StatCard label="Owed now" value={bills.isPending ? "…" : formatNaira(owed)} icon={AlarmClock} />
        <StatCard
          label="Months paid"
          value={bills.isPending ? "…" : `${paidCount} of ${list.length}`}
          icon={CalendarCheck}
        />
        <StatCard
          label="Late months"
          value={bills.isPending ? "…" : lateCount}
          icon={CalendarRange}
          note={lateCount > 0 ? "Past months not fully paid" : undefined}
        />
      </div>

      <section className="grid gap-4" aria-labelledby="bills-title">
        <h2 id="bills-title" className="font-wide text-xl font-extrabold">
          Bills
        </h2>
        {bills.isError ? (
          <QueryError error={bills.error} onRetry={() => void bills.refetch()} />
        ) : bills.isPending ? (
          <Skeleton className="h-60" />
        ) : list.length === 0 ? (
          <EmptyState
            icon={CalendarRange}
            title={hasPlan ? "No bills yet" : "No monthly plan yet"}
            description={
              hasPlan
                ? "Bills appear here month by month."
                : "Set a monthly amount to start their plan. This month's bill is created straight away."
            }
            action={
              !hasPlan && (
                <Button size="lg" onClick={() => setEditing(true)}>
                  <Banknote /> Set monthly amount
                </Button>
              )
            }
          />
        ) : (
          <BillsList bills={list} />
        )}
      </section>

      <MonthlyAmountDialog user={user} open={editing} onOpenChange={setEditing} />
    </div>
  );
}
