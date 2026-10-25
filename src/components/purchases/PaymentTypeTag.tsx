import type { Payment } from "@/api/member";
import { cn } from "@/lib/utils";

const config: Record<Payment["type"], { label: string; className: string }> = {
  MONTHLY: { label: "Bill", className: "bg-ink text-paper" },
  SPLIT: { label: "Bill + extra", className: "bg-volt text-volt-foreground" },
  ADDITIONAL: { label: "Extra", className: "bg-muted text-foreground ring-1 ring-border" },
};

/** How a payment was counted: toward the bill, extra, or both */
export function PaymentTypeTag({ type }: { type: Payment["type"] }) {
  const { label, className } = config[type];
  return <span className={cn("rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap", className)}>{label}</span>;
}
