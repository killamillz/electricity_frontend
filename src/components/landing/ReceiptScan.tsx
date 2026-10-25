import { useRef } from "react";
import { Check, ImageUp, KeyRound, PencilLine } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { SectionHeading } from "./SectionHeading";

const receiptLines = [
  ["Date", "14/10/2026 14:32"],
  ["Meter no.", "0141 2290 331"],
  ["Amount", "₦8,000.00"],
  ["Units", "96.4 kWh"],
];

const extracted = [
  { label: "Amount", value: "₦8,000" },
  { label: "Units", value: "96.4 kWh" },
  { label: "Date", value: "14 Oct 2026" },
  { label: "Token", value: "4821 0937 1156 2280 7743" },
];

const points = [
  { icon: ImageUp, text: "JPEG, PNG, WebP or GIF, up to 5 MB. The photo is kept with the purchase." },
  { icon: PencilLine, text: "Anything that isn't clear is left blank for you to fill in. Nothing is guessed." },
  { icon: KeyRound, text: "Each 20-digit token can only be recorded once, so nothing counts twice." },
];

export function ReceiptScan() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from("[data-reveal='heading'], [data-point]", {
          y: 30,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: scope.current, start: "top 70%" },
        });

        // Scan line sweeps the receipt while it's on screen
        gsap.fromTo(
          "[data-scan='line']",
          { top: "0%" },
          {
            top: "100%",
            duration: 2.2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            scrollTrigger: { trigger: "[data-scan='receipt']", toggleActions: "play pause resume pause" },
          },
        );

        // Fields fill in one by one, as if just read from the receipt
        const tl = gsap.timeline({ scrollTrigger: { trigger: "[data-scan='card']", start: "top 80%" } });
        tl.from("[data-scan='receipt']", { y: 40, rotate: -8, autoAlpha: 0, duration: 1, ease: "power3.out" })
          .from("[data-scan='card']", { y: 40, rotate: 6, autoAlpha: 0, duration: 1, ease: "power3.out" }, "-=0.6")
          .from("[data-scan='check']", { scale: 0, duration: 0.35, ease: "back.out(3)", stagger: 0.35 }, "-=0.3");
        gsap.utils.toArray<HTMLElement>("[data-scan='value']").forEach((el, i) => {
          tl.to(
            el,
            { scrambleText: { text: el.textContent ?? "", chars: "0123456789", speed: 0.4 }, duration: 0.8 },
            i === 0 ? "<" : "<0.35", // in step with the checkmarks
          );
        });
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="receipts"
      className="relative scroll-mt-16 overflow-hidden bg-ink py-24 text-paper sm:py-32"
      aria-labelledby="receipts-title"
    >
      <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
      <Container className="relative grid items-center gap-16 lg:grid-cols-2">
        <div>
          <SectionHeading
            id="receipts-title"
            tone="light"
            eyebrow="02 · Receipt scanning"
            title={
              <>
                Snap the receipt.
                <br />
                <span className="text-volt">Skip the typing.</span>
              </>
            }
            description="Upload a photo of your token receipt and the amount, units, date and token fill themselves in. You check the numbers. Nothing saves until you confirm."
          />
          <ul className="mt-10 grid gap-4">
            {points.map(({ icon: Icon, text }) => (
              <li key={text} data-point className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/5 text-volt ring-1 ring-white/10">
                  <Icon className="size-4.5" />
                </span>
                <p className="pt-2 text-paper/75">{text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md pb-24 sm:pb-16" aria-hidden>
          {/* Paper receipt */}
          <div data-scan="receipt" className="relative w-[78%] -rotate-3 sm:w-[70%]">
            <div className="relative overflow-hidden rounded-t-lg bg-paper px-5 pt-6 pb-5 font-mono text-[13px] text-ink shadow-2xl">
              <p className="text-center text-xs font-medium tracking-[0.2em]">PREPAID VEND RECEIPT</p>
              <p className="mt-1 text-center text-[11px] text-ink/50">Thank you for your purchase</p>
              <div className="my-4 border-t border-dashed border-ink/25" />
              <dl className="grid gap-2">
                {receiptLines.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-3">
                    <dt className="text-ink/55">{label}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="my-4 border-t border-dashed border-ink/25" />
              <p className="text-[11px] text-ink/55">TOKEN</p>
              <p className="mt-1 text-[15px] leading-snug font-medium tracking-wide">
                4821 0937 1156
                <br />
                2280 7743
              </p>
              <div data-scan="line" className="absolute inset-x-0 h-0.5 bg-volt shadow-[0_0_16px_4px_var(--volt)]" />
            </div>
            {/* Torn bottom edge */}
            <div className="h-3 bg-[radial-gradient(circle_at_8px_12px,transparent_6px,var(--paper)_6.5px)] bg-size-[16px_12px]" />
          </div>

          {/* What was read */}
          <div
            data-scan="card"
            className="absolute right-0 bottom-0 w-[78%] rotate-2 rounded-2xl bg-card p-5 text-ink shadow-2xl ring-1 ring-black/5 sm:w-[68%]"
          >
            <p className="flex items-center gap-2 text-sm font-semibold">
              <span className="size-2 rounded-full bg-paid" /> Check and save
            </p>
            <dl className="mt-4 grid gap-3">
              {extracted.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-3 border-b border-border pb-2 last:border-0 last:pb-0">
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="flex items-center gap-2 text-right font-mono text-[13px] font-medium">
                    <span data-scan="value">{value}</span>
                    <span data-scan="check" className="grid size-4 place-items-center rounded-full bg-paid text-white">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
