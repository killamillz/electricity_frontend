import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type ReceiptPreviewProps = {
  file: File;
  /** Shows a sweeping scan line over the photo */
  scanning?: boolean;
  /** Buttons under the photo, e.g. "Change photo" */
  children?: ReactNode;
  className?: string;
};

export function ReceiptPreview({ file, scanning, children, className }: ReceiptPreviewProps) {
  const scope = useRef<HTMLDivElement>(null);
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);

  useGSAP(
    () => {
      if (!scanning) return;
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo("[data-scan-line]", { top: "0%" }, { top: "100%", duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
    },
    { scope, dependencies: [scanning], revertOnUpdate: true },
  );

  return (
    <div className={cn("grid gap-3", className)}>
      <div ref={scope} className="relative overflow-hidden rounded-2xl bg-ink ring-1 ring-border">
        <img src={url} alt="Your receipt" className={cn("max-h-[60svh] w-full object-contain", scanning && "opacity-70")} />
        {scanning && (
          <>
            <div data-scan-line className="absolute inset-x-0 top-1/2 h-0.5 bg-volt shadow-[0_0_18px_5px_var(--volt)]" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-4 text-center text-sm font-medium text-paper">
              Reading your receipt…
            </div>
          </>
        )}
      </div>
      {children}
    </div>
  );
}
