import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, CalendarDays, Gauge, KeyRound } from "lucide-react";
import { z } from "zod";
import { useRecordPayment, type NewPayment, type RecordedPayment, type ScannedReceipt } from "@/api/member";
import { errorMessage } from "@/api/errors";
import { FormAlert } from "@/components/form/FormAlert";
import { SubmitButton } from "@/components/form/SubmitButton";
import { TextField } from "@/components/form/TextField";
import { lagosDayOf, lagosToday } from "@/lib/dates";
import { formatToken } from "@/lib/format";

// Same rules as the backend
const purchaseSchema = z.object({
  amount: z.number({ error: "Enter the amount you paid" }).positive("The amount must be more than ₦0"),
  kilowattHours: z.number({ error: "Enter the units you got" }).positive("Units must be more than 0"),
  token: z
    .string()
    .transform((t) => t.replace(/[\s-]/g, ""))
    .refine((t) => t === "" || /^\d{20}$/.test(t), "The token should be 20 digits"),
  date: z
    .string()
    .min(1, "Pick the date you bought it")
    .refine((d) => d <= lagosToday(), "The date can't be in the future"),
});

type PurchaseInput = z.input<typeof purchaseSchema>;
type PurchaseValues = z.output<typeof purchaseSchema>;

/**
 * Turns the chosen day into the time sent to the API: the scanned time if the
 * day wasn't changed, now if it's today, otherwise midday in Lagos.
 */
const purchaseTime = (date: string, scannedAt: string | null) => {
  if (scannedAt && lagosDayOf(scannedAt) === date) return new Date(scannedAt).toISOString();
  if (date === lagosToday()) return new Date().toISOString();
  return new Date(`${date}T12:00:00+01:00`).toISOString();
};

type PurchaseFormProps = {
  /** Values read from a receipt; null fields were unreadable */
  scanned?: ScannedReceipt;
  /** Photo saved with the purchase as proof */
  receipt?: File;
  onSaved: (result: RecordedPayment) => void;
};

export function PurchaseForm({ scanned, receipt, onSaved }: PurchaseFormProps) {
  const record = useRecordPayment();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PurchaseInput, unknown, PurchaseValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      amount: scanned?.amount ?? undefined,
      kilowattHours: scanned?.kilowattHours ?? undefined,
      token: scanned?.token ? formatToken(scanned.token) : "",
      date: scanned?.purchasedAt ? lagosDayOf(scanned.purchasedAt) : lagosToday(),
    },
  });

  // Point out fields the scan couldn't read
  const unread = (field: keyof ScannedReceipt) =>
    scanned && scanned[field] === null ? "Couldn't read this from the receipt. Please fill it in." : undefined;

  const submit = ({ amount, kilowattHours, token, date }: PurchaseValues) => {
    const payment: NewPayment = {
      amount,
      kilowattHours,
      token: token || undefined,
      purchasedAt: purchaseTime(date, scanned?.purchasedAt ?? null),
      source: scanned ? "RECEIPT" : "MANUAL",
      receipt,
    };
    record.mutate(payment, { onSuccess: onSaved });
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="grid gap-5">
      {record.isError && <FormAlert>{errorMessage(record.error)}</FormAlert>}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Amount paid (₦)"
          type="number"
          inputMode="decimal"
          step="any"
          min={0}
          icon={Banknote}
          placeholder="5000"
          hint={unread("amount")}
          error={errors.amount?.message}
          {...register("amount", { valueAsNumber: true })}
        />
        <TextField
          label="Units (kWh)"
          type="number"
          inputMode="decimal"
          step="any"
          min={0}
          icon={Gauge}
          placeholder="60.5"
          hint={unread("kilowattHours")}
          error={errors.kilowattHours?.message}
          {...register("kilowattHours", { valueAsNumber: true })}
        />
      </div>
      <TextField
        label="Token (optional)"
        inputMode="numeric"
        autoComplete="off"
        icon={KeyRound}
        placeholder="1234 5678 9012 3456 7890"
        className="font-mono tracking-wide"
        hint={unread("token") ?? "The 20-digit number you type into the meter. Each token can only be recorded once."}
        error={errors.token?.message}
        {...register("token")}
      />
      <TextField
        label="Date bought"
        type="date"
        max={lagosToday()}
        icon={CalendarDays}
        hint={unread("purchasedAt") ?? "It counts toward that month's bill."}
        error={errors.date?.message}
        {...register("date")}
      />

      <SubmitButton loading={record.isPending}>Save purchase</SubmitButton>
    </form>
  );
}
