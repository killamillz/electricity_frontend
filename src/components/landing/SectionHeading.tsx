import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Small label above the title, e.g. "01 · How it works" */
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  id?: string;
  /** "light" for dark backgrounds */
  tone?: "dark" | "light";
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, id, tone = "dark", className }: SectionHeadingProps) {
  const light = tone === "light";

  return (
    <div data-reveal="heading" className={cn("max-w-2xl", className)}>
      <p
        className={cn(
          "font-mono text-xs tracking-[0.2em] uppercase",
          light ? "text-volt" : "text-muted-foreground",
        )}
      >
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-4 font-wide text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] font-black tracking-[-0.02em]"
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-5 text-lg", light ? "text-paper/70" : "text-muted-foreground")}>{description}</p>
      )}
    </div>
  );
}
