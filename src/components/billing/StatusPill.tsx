import { cn } from "@/lib/utils";

export type BillStatus = "PAID" | "PENDING" | "LATE";

const styles: Record<BillStatus, string> = {
  PAID: "bg-paid/15 text-paid ring-paid/30",
  PENDING: "bg-pending/15 text-pending ring-pending/30",
  LATE: "bg-late/15 text-late ring-late/30",
};

const labels: Record<BillStatus, string> = { PAID: "Paid", PENDING: "Pending", LATE: "Late" };

/** Coloured bill status label: green paid, amber pending, red late */
export function StatusPill({ status, className }: { status: BillStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        styles[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {labels[status]}
    </span>
  );
}
