import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useSetMonthlyAmount, type AdminUser } from "@/api/admin";
import { errorMessage } from "@/api/errors";
import { fullName } from "@/auth/auth-context";
import { FormAlert } from "@/components/form/FormAlert";
import { TextField } from "@/components/form/TextField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const amountSchema = z.object({
  monthlyAmount: z
    .number({ error: "Enter an amount in naira" })
    .positive("The amount must be more than ₦0")
    .max(100_000_000, "That amount looks too large"),
});

type AmountValues = z.infer<typeof amountSchema>;

type MonthlyAmountDialogProps = {
  user: AdminUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Set, change or remove a user's monthly amount */
export function MonthlyAmountDialog({ user, open, onOpenChange }: MonthlyAmountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* Mounted only while open, so the form starts fresh each time */}
        <AmountForm user={user} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function AmountForm({ user, onDone }: { user: AdminUser; onDone: () => void }) {
  const hasPlan = user.monthlyAmount !== null;
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const setAmount = useSetMonthlyAmount(user.id);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AmountValues>({
    resolver: zodResolver(amountSchema),
    defaultValues: hasPlan ? { monthlyAmount: user.monthlyAmount ?? undefined } : undefined,
  });

  const save = (monthlyAmount: number | null) =>
    setAmount.mutate(monthlyAmount, {
      onSuccess: ({ message }) => {
        toast.success(message);
        onDone();
      },
    });

  return (
    <form onSubmit={handleSubmit(({ monthlyAmount }) => save(monthlyAmount))} noValidate className="grid gap-5">
      <DialogHeader>
        <DialogTitle className="font-wide text-lg font-extrabold">
          {hasPlan ? "Change monthly amount" : "Set monthly amount"}
        </DialogTitle>
        <DialogDescription>
          For <span className="font-medium text-foreground">{fullName(user)}</span>.{" "}
          {hasPlan
            ? "The new amount applies to this month's bill if it isn't paid yet. Past months keep their amount."
            : "This creates this month's bill. A new bill then appears every month."}
        </DialogDescription>
      </DialogHeader>

      {setAmount.isError && <FormAlert>{errorMessage(setAmount.error)}</FormAlert>}

      <TextField
        label="Amount per month (₦)"
        type="number"
        inputMode="decimal"
        min={1}
        step="any"
        icon={Banknote}
        placeholder="10000"
        autoFocus
        error={errors.monthlyAmount?.message}
        {...register("monthlyAmount", { valueAsNumber: true })}
      />

      {hasPlan && confirmingRemove && (
        <FormAlert>
          Remove the plan? No new bills will be created. This month's bill is deleted if nothing has been paid toward
          it.{" "}
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="mt-2"
            disabled={setAmount.isPending}
            onClick={() => save(null)}
          >
            Yes, remove plan
          </Button>
        </FormAlert>
      )}

      <DialogFooter>
        {hasPlan && !confirmingRemove && (
          <Button
            type="button"
            variant="destructive"
            size="lg"
            className="sm:mr-auto"
            onClick={() => setConfirmingRemove(true)}
          >
            <Trash2 /> Remove plan
          </Button>
        )}
        <Button type="button" variant="outline" size="lg" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" size="lg" disabled={setAmount.isPending}>
          {setAmount.isPending && <Loader2 className="animate-spin" />}
          {hasPlan ? "Save" : "Set amount"}
        </Button>
      </DialogFooter>
    </form>
  );
}
