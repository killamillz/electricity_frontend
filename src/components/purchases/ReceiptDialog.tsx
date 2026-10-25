import { Loader2 } from "lucide-react";
import { useReceiptLink } from "@/api/member";
import { QueryError } from "@/components/feedback/States";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ReceiptDialogProps = {
  paymentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Shows the saved receipt photo for one of the user's payments */
export function ReceiptDialog({ paymentId, open, onOpenChange }: ReceiptDialogProps) {
  const link = useReceiptLink(paymentId, open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-wide font-extrabold">Receipt</DialogTitle>
        </DialogHeader>
        {link.isError ? (
          <QueryError error={link.error} onRetry={() => void link.refetch()} />
        ) : link.data ? (
          <img
            src={link.data.url}
            alt="Receipt photo"
            className="max-h-[70svh] w-full rounded-lg bg-muted object-contain"
          />
        ) : (
          <div className="grid h-64 place-items-center rounded-lg bg-muted">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
