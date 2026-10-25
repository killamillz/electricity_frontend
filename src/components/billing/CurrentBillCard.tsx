import type { Bill } from "@/api/admin";
import { formatMonth, formatNaira } from "@/lib/format";
import { cn } from "@/lib/utils";
import { StatusPill } from "./StatusPill";

const barColor = { PAID: "bg-paid", PENDING: "bg-volt", LATE: "bg-late" } as const;

/** Big dark card for this month's bill, or a note when there's no plan */
export function CurrentBillCard({ bill, month }: { bill?: Bill; month: string }) {
  if (!bill) {
    return (
      <div className="rounded-3xl bg-ink p-6 text-paper sm:p-8">
        <p className="text-sm text-paper/60">{formatMonth(month)}</p>
        <p className="mt-2 font-wide text-2xl font-black">No bill this month</p>
        <p className="mt-2 max-w-md text-sm text-paper/60">
          Your admin hasn't set a monthly amount for you yet. Purchases you record still count, as extra.
        </p>
      </div>
    );
  }

  const ratio = bill.amountDue > 0 ? Math.min(bill.amountPaid / bill.amountDue, 1) : 1;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-ink p-6 text-paper sm:p-8">
      <div className="absolute -top-20 -right-20 size-64 rounded-full bg-volt/15 blur-3xl" aria-hidden />
      <div className="relative flex items-center justify-between gap-3">
        <p className="text-sm text-paper/60">{formatMonth(bill.month)} bill</p>
        <StatusPill status={bill.status} />
      </div>
      <p className="relative mt-4 font-wide text-4xl font-black tabular-nums sm:text-5xl">
        {formatNaira(bill.amountPaid)}
        <span className="text-xl text-paper/40 sm:text-2xl"> / {formatNaira(bill.amountDue)}</span>
      </p>
      <div
        className="relative mt-5 h-3 overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={bill.amountDue}
        aria-valuenow={bill.amountPaid}
        aria-label="Amount paid this month"
      >
        <div className={cn("h-full rounded-full transition-[width] duration-700", barColor[bill.status])} style={{ width: `${ratio * 100}%` }} />
      </div>
      <p className="relative mt-3 text-sm text-paper/60">
        {bill.remaining > 0 ? `${formatNaira(bill.remaining)} left to pay this month` : "All paid for this month."}
      </p>
    </div>
  );
}
