import { Link } from "react-router";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Link to the record-purchase page, styled as the main action */
export function RecordPurchaseButton({ size = "xl", className }: { size?: "lg" | "xl"; className?: string }) {
  return (
    <Link to="/purchases/new" className={cn(buttonVariants({ size }), className)}>
      <Plus /> Record purchase
    </Link>
  );
}
