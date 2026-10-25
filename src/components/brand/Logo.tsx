import { Link } from "react-router";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/config";

type LogoProps = {
  /** "light" for dark backgrounds */
  tone?: "dark" | "light";
  className?: string;
  /** e.g. "max-[400px]:sr-only" to show only the mark on narrow screens */
  wordmarkClassName?: string;
};

export function Logo({ tone = "dark", className, wordmarkClassName }: LogoProps) {
  return (
    <Link
      to="/"
      aria-label={`${APP_NAME} home`}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        tone === "light" ? "text-paper" : "text-ink",
        className,
      )}
    >
      <span className="grid size-8 place-items-center rounded-lg bg-volt text-volt-foreground">
        <Zap className="size-4.5" fill="currentColor" strokeWidth={1.5} />
      </span>
      <span className={cn("font-wide text-[15px] font-extrabold tracking-tight", wordmarkClassName)}>{APP_NAME}</span>
    </Link>
  );
}
