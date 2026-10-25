import type { ComponentProps } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SubmitButtonProps = ComponentProps<typeof Button> & {
  loading?: boolean;
};

/** Full-width form submit button that shows a spinner and blocks double submits */
export function SubmitButton({ loading, disabled, children, className, ...props }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      size="xl"
      disabled={loading || disabled}
      aria-busy={loading || undefined}
      className={cn("w-full", className)}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  );
}
