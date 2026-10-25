import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  /** Small label above the title, e.g. "Admin" */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Buttons on the right, e.g. "Set amount" */
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ eyebrow, title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">{eyebrow}</p>
        )}
        <h1 className="mt-2 font-wide text-3xl font-black tracking-tight break-words sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
