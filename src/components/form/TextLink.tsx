import { Link, type LinkProps } from "react-router";
import { cn } from "@/lib/utils";

/** Inline underlined link inside body text */
export function TextLink({ className, ...props }: LinkProps) {
  return (
    <Link
      className={cn(
        "font-semibold text-foreground underline decoration-volt decoration-2 underline-offset-4 hover:decoration-foreground",
        className,
      )}
      {...props}
    />
  );
}
