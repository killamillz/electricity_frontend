import { useState } from "react";
import { Image, Keyboard, ScanLine } from "lucide-react";
import type { Payment } from "@/api/member";
import { Button } from "@/components/ui/button";
import { formatDate, formatKwh, formatNaira, formatToken } from "@/lib/format";
import { PaymentTypeTag } from "./PaymentTypeTag";
import { ReceiptDialog } from "./ReceiptDialog";

/** The user's purchases, newest first, with how each one was counted */
export function PurchasesList({ payments, limit }: { payments: Payment[]; limit?: number }) {
  const [viewing, setViewing] = useState<string | null>(null);
  const sorted = [...payments].sort((a, b) => b.purchasedAt.localeCompare(a.purchasedAt)).slice(0, limit);

  return (
    <>
      <ul className="divide-y divide-border overflow-hidden rounded-2xl bg-card ring-1 ring-border">
        {sorted.map((p) => {
          const SourceIcon = p.source === "RECEIPT" ? ScanLine : Keyboard;
          return (
            <li key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 p-4 sm:flex-nowrap">
              <span
                className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground"
                title={p.source === "RECEIPT" ? "From a scanned receipt" : "Typed in"}
              >
                <SourceIcon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-medium tabular-nums">{formatNaira(p.amount)}</span>
                  <PaymentTypeTag type={p.type} />
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatDate(p.purchasedAt)} · {formatKwh(p.kilowattHours)}
                  {p.token && <span className="hidden font-mono sm:inline"> · {formatToken(p.token)}</span>}
                </p>
              </div>
              <div className="flex items-center gap-3 max-sm:w-full max-sm:justify-between max-sm:pl-14">
                {p.type === "SPLIT" && (
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {formatNaira(p.billAmount)} bill · {formatNaira(p.extraAmount)} extra
                  </span>
                )}
                {p.hasReceiptImage && (
                  <Button variant="outline" size="sm" onClick={() => setViewing(p.id)}>
                    <Image /> Receipt
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {viewing && <ReceiptDialog paymentId={viewing} open onOpenChange={(open) => !open && setViewing(null)} />}
    </>
  );
}
