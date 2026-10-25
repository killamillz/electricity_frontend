import { useState } from "react";
import { useNavigate } from "react-router";
import { Keyboard, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useScanReceipt, type RecordedPayment, type ScannedReceipt } from "@/api/member";
import { errorMessage } from "@/api/errors";
import { FormAlert } from "@/components/form/FormAlert";
import { PageHeader } from "@/components/layout/PageHeader";
import { PurchaseForm } from "@/components/purchases/PurchaseForm";
import { ReceiptPicker } from "@/components/purchases/ReceiptPicker";
import { ReceiptPreview } from "@/components/purchases/ReceiptPreview";
import { Button } from "@/components/ui/button";
import { formatMonth, formatNaira } from "@/lib/format";

type Step =
  | { name: "pick" }
  | { name: "scanning"; file: File }
  | { name: "review"; file?: File; scanned?: ScannedReceipt; scanError?: string };

/** "₦4,000 toward October's bill and ₦2,000 extra" */
const savedMessage = ({ payment, bill }: RecordedPayment) => {
  const month = bill ? `${formatMonth(bill.month).split(" ")[0]}'s bill` : "your bill";
  if (payment.type === "MONTHLY") return `${formatNaira(payment.billAmount)} counted toward ${month}.`;
  if (payment.type === "SPLIT")
    return `${formatNaira(payment.billAmount)} toward ${month}, ${formatNaira(payment.extraAmount)} as extra.`;
  return `${formatNaira(payment.amount)} recorded as extra.`;
};

/** Record a purchase: scan a receipt (then check it) or type it in */
export default function NewPurchasePage() {
  const navigate = useNavigate();
  const scan = useScanReceipt();
  const [step, setStep] = useState<Step>({ name: "pick" });

  const startScan = (file: File) => {
    setStep({ name: "scanning", file });
    scan.mutate(file, {
      onSuccess: (scanned) => setStep({ name: "review", file, scanned }),
      // Unreadable receipt or scanning unavailable: type it in, the photo is still saved
      onError: (error) => setStep({ name: "review", file, scanError: errorMessage(error) }),
    });
  };

  const onSaved = (result: RecordedPayment) => {
    toast.success("Purchase saved", { description: savedMessage(result) });
    navigate("/purchases");
  };

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="New purchase"
        title="Record a purchase"
        description="Scan the receipt to fill the details in for you, or type them yourself."
      />

      {step.name === "pick" && (
        <div className="grid gap-4">
          <ReceiptPicker onFile={startScan} />
          <Button variant="ghost" size="lg" className="justify-self-center" onClick={() => setStep({ name: "review" })}>
            <Keyboard /> No receipt? Type it in instead
          </Button>
        </div>
      )}

      {step.name === "scanning" && <ReceiptPreview file={step.file} scanning className="mx-auto w-full max-w-md" />}

      {step.name === "review" && (
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {step.file ? (
            <ReceiptPreview file={step.file}>
              <div className="flex gap-2">
                <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep({ name: "pick" })}>
                  <RefreshCw /> Use another photo
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setStep({ name: "review", scanned: step.scanned })}
                  aria-label="Remove photo"
                >
                  <Trash2 />
                </Button>
              </div>
            </ReceiptPreview>
          ) : (
            <div className="rounded-2xl bg-muted/60 p-5 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Typing it in</p>
              <p className="mt-1">Have the receipt after all?</p>
              <Button variant="outline" size="lg" className="mt-4" onClick={() => setStep({ name: "pick" })}>
                Scan a receipt
              </Button>
            </div>
          )}

          <div className="grid gap-5 rounded-3xl bg-card p-5 ring-1 ring-border sm:p-7">
            {step.scanned && (
              <FormAlert tone="success">Receipt read. Check every number against the receipt, then save.</FormAlert>
            )}
            {step.scanError && (
              <FormAlert>
                {step.scanError} Fill in the details below. Your photo will still be saved with the purchase.
              </FormAlert>
            )}
            {/* key: start a fresh form for each new scan */}
            <PurchaseForm
              key={step.file ? `${step.file.name}-${step.file.lastModified}-${step.scanned ? "s" : "m"}` : "manual"}
              scanned={step.scanned}
              receipt={step.file}
              onSaved={onSaved}
            />
          </div>
        </div>
      )}
    </div>
  );
}
