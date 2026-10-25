import { AlarmClock, CalendarCheck, CalendarRange } from "lucide-react";
import { useMyBills } from "@/api/member";
import { BillsList } from "@/components/billing/BillsList";
import { CurrentBillCard } from "@/components/billing/CurrentBillCard";
import { EmptyState, QueryError, Skeleton } from "@/components/feedback/States";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { currentMonthKey } from "@/lib/dates";
import { formatNaira } from "@/lib/format";

export default function BillsPage() {
  const bills = useMyBills();
  const list = bills.data ?? [];
  const month = currentMonthKey();
  const owed = list.filter((b) => b.status !== "PAID").reduce((sum, b) => sum + b.remaining, 0);
  const late = list.filter((b) => b.status === "LATE").length;

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Bills"
        title="Your monthly bills"
        description="Each month's bill is paid off by the purchases you make that month. Past months not fully paid show as late."
      />

      {bills.isError ? (
        <QueryError error={bills.error} onRetry={() => void bills.refetch()} />
      ) : bills.isPending ? (
        <Skeleton className="h-80" />
      ) : (
        <>
          <CurrentBillCard bill={list.find((b) => b.month === month)} month={month} />
          {list.length > 0 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="Owed now" value={formatNaira(owed)} icon={AlarmClock} />
                <StatCard
                  label="Months paid"
                  value={`${list.filter((b) => b.status === "PAID").length} of ${list.length}`}
                  icon={CalendarCheck}
                />
                <StatCard label="Late months" value={late} icon={CalendarRange} />
              </div>
              <BillsList bills={list} />
            </>
          ) : (
            <EmptyState
              icon={CalendarRange}
              title="No bills yet"
              description="Bills start once your admin sets your monthly amount."
            />
          )}
        </>
      )}
    </div>
  );
}
