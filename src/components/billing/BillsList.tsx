import type { Bill } from "@/api/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatMonth, formatNaira } from "@/lib/format";
import { cn } from "@/lib/utils";
import { StatusPill } from "./StatusPill";

/** Small progress bar of how much of a bill is paid */
function PaidBar({ bill }: { bill: Bill }) {
  const ratio = bill.amountDue > 0 ? Math.min(bill.amountPaid / bill.amountDue, 1) : 1;
  const color = { PAID: "bg-paid", PENDING: "bg-pending", LATE: "bg-late" }[bill.status];

  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted" aria-hidden>
      <div className={cn("h-full rounded-full", color)} style={{ width: `${ratio * 100}%` }} />
    </div>
  );
}

/** A user's monthly bills, newest first: a table on wide screens, cards on phones */
export function BillsList({ bills }: { bills: Bill[] }) {
  const sorted = [...bills].sort((a, b) => b.month.localeCompare(a.month));

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl bg-card ring-1 ring-border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Month</TableHead>
              <TableHead className="text-right">Amount due</TableHead>
              <TableHead className="w-40">Paid</TableHead>
              <TableHead className="text-right">Remaining</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-5">Paid on</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell className="pl-5 font-medium">{formatMonth(bill.month)}</TableCell>
                <TableCell className="text-right font-mono tabular-nums">{formatNaira(bill.amountDue)}</TableCell>
                <TableCell>
                  <div className="grid gap-1.5">
                    <span className="font-mono text-xs tabular-nums">{formatNaira(bill.amountPaid)}</span>
                    <PaidBar bill={bill} />
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">{formatNaira(bill.remaining)}</TableCell>
                <TableCell>
                  <StatusPill status={bill.status} />
                </TableCell>
                <TableCell className="pr-5 text-muted-foreground">{bill.paidAt ? formatDate(bill.paidAt) : "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="grid gap-3 md:hidden">
        {sorted.map((bill) => (
          <li key={bill.id} className="rounded-2xl bg-card p-4 ring-1 ring-border">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">{formatMonth(bill.month)}</p>
              <StatusPill status={bill.status} />
            </div>
            <div className="mt-3 flex items-baseline justify-between font-mono text-sm tabular-nums">
              <span>
                {formatNaira(bill.amountPaid)}
                <span className="text-muted-foreground"> / {formatNaira(bill.amountDue)}</span>
              </span>
              {bill.remaining > 0 && <span className="text-xs text-muted-foreground">{formatNaira(bill.remaining)} left</span>}
            </div>
            <div className="mt-2">
              <PaidBar bill={bill} />
            </div>
            {bill.paidAt && <p className="mt-2 text-xs text-muted-foreground">Paid {formatDate(bill.paidAt)}</p>}
          </li>
        ))}
      </ul>
    </>
  );
}
