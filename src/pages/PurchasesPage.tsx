import { Banknote, Gauge, Receipt } from "lucide-react";
import { useMyPayments } from "@/api/member";
import { EmptyState, QueryError, Skeleton } from "@/components/feedback/States";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { PurchasesList } from "@/components/purchases/PurchasesList";
import { RecordPurchaseButton } from "@/components/purchases/RecordPurchaseButton";
import { formatKwh, formatNaira } from "@/lib/format";

export default function PurchasesPage() {
  const payments = useMyPayments();
  const list = payments.data ?? [];
  const total = list.reduce((sum, p) => sum + p.amount, 0);
  const units = list.reduce((sum, p) => sum + p.kilowattHours, 0);

  return (
    <div className="grid gap-8">
      <PageHeader eyebrow="History" title="Your purchases" actions={<RecordPurchaseButton />} />

      {payments.isError ? (
        <QueryError error={payments.error} onRetry={() => void payments.refetch()} />
      ) : payments.isPending ? (
        <Skeleton className="h-80" />
      ) : list.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No purchases yet"
          description="Record your first token purchase. Snapping the receipt is the quickest way."
          action={<RecordPurchaseButton />}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Total spent" value={formatNaira(total)} icon={Banknote} tone="dark" />
            <StatCard label="Units bought" value={formatKwh(units)} icon={Gauge} />
            <StatCard label="Purchases" value={list.length} icon={Receipt} />
          </div>
          <PurchasesList payments={list} />
        </>
      )}
    </div>
  );
}
