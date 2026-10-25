import type { ReactNode } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type FormAlertProps = {
  tone?: "error" | "success";
  children: ReactNode;
  className?: string;
};

/** Message box above or below a form, e.g. "Invalid credentials" */
export function FormAlert({ tone = "error", children, className }: FormAlertProps) {
  const Icon = tone === "error" ? CircleAlert : CircleCheck;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex gap-3 rounded-xl border px-4 py-3 text-sm",
        tone === "error"
          ? "border-late/30 bg-late/8 text-late"
          : "border-paid/30 bg-paid/8 text-[oklch(0.42_0.12_152)]",
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
