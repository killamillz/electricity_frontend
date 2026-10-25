import { Loader2, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FullPageSpinner() {
  return (
    <div className="grid min-h-svh place-items-center" role="status" aria-live="polite">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function FullPageError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="grid min-h-svh place-items-center px-4">
      <div className="max-w-sm text-center">
        <WifiOff className="mx-auto size-8 text-muted-foreground" />
        <h1 className="mt-4 font-wide text-xl font-bold">Can't reach the server</h1>
        <p className="mt-2 text-muted-foreground">Check your connection, then try again.</p>
        <Button className="mt-6" size="lg" onClick={onRetry}>
          Try again
        </Button>
      </div>
    </div>
  );
}
