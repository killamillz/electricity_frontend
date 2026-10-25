import { useId, type ComponentProps, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type TextFieldProps = ComponentProps<"input"> & {
  label: string;
  /** Validation message; also marks the input invalid */
  error?: string;
  /** Help text shown when there is no error */
  hint?: string;
  icon?: LucideIcon;
  /** Content inside the right edge of the input, e.g. a show-password button */
  endSlot?: ReactNode;
};

/**
 * Label + input + error message. Works with react-hook-form:
 *   <TextField label="Email" error={errors.email?.message} {...register("email")} />
 */
export function TextField({ label, error, hint, icon: Icon, endSlot, id, className, ...props }: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;

  return (
    <div className="grid gap-2">
      <Label htmlFor={inputId}>{label}</Label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn("h-11 rounded-xl bg-card px-3.5", Icon && "pl-10", endSlot && "pr-11", className)}
          {...props}
        />
        {endSlot && <div className="absolute inset-y-0 right-1.5 flex items-center">{endSlot}</div>}
      </div>
      {message && (
        <p
          id={messageId}
          className={cn("text-sm", error ? "text-destructive" : "text-muted-foreground")}
          role={error ? "alert" : undefined}
        >
          {message}
        </p>
      )}
    </div>
  );
}
