import { useRef } from "react";
import { StatusPill } from "@/components/billing/StatusPill";
import { Container } from "@/components/layout/Container";
import { formatNaira } from "@/lib/format";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { SectionHeading } from "./SectionHeading";

const MONTHLY_AMOUNT = 10000;

// The worked example from the backend README
const payments = [
  { paid: 6000, toBill: 6000, extra: 0, note: "₦4,000 left this month" },
  { paid: 8000, toBill: 4000, extra: 4000, note: "Bill covered, ₦4,000 extra" },
  { paid: 2000, toBill: 0, extra: 2000, note: "Already paid, all extra" },
];

export function PaymentSplit() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from("[data-reveal='heading']", {
          y: 30,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: scope.current, start: "top 75%" },
        });

        // Scrolling plays the three payments in order
        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: { trigger: "[data-split='card']", start: "top 75%", end: "bottom 45%", scrub: 0.8 },
        });
        // fromTo renders its start state straight away, so rows start dimmed and the pill starts pending
        const row = (n: number) => `[data-split='row']:nth-child(${n})`;
        const dimmed = { autoAlpha: 0.3 };
        const lit = { autoAlpha: 1, duration: 0.3 };

        // ₦6,000: all toward the bill
        tl.fromTo("[data-split='seg-0']", { scaleX: 0 }, { scaleX: 1, duration: 1 })
          .fromTo(row(1), dimmed, lit, "<")
          // ₦8,000: ₦4,000 finishes the bill, ₦4,000 is extra
          .fromTo("[data-split='seg-1']", { scaleX: 0 }, { scaleX: 1, duration: 1 }, "+=0.3")
          .fromTo(row(2), dimmed, lit, "<")
          .fromTo("[data-split='pending']", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.2 })
          .fromTo("[data-split='paid']", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, "<")
          .fromTo("[data-split='extra-0']", { y: 16, scale: 0.8, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.5 }, "<")
          // ₦2,000: all extra
          .fromTo(row(3), dimmed, lit, "+=0.3")
          .fromTo("[data-split='extra-1']", { y: 16, scale: 0.8, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.5 }, "<");
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="py-24 sm:py-32" aria-labelledby="split-title">
      <Container className="grid items-center gap-14 lg:grid-cols-[1fr_1.15fr]">
        <SectionHeading
          id="split-title"
          eyebrow="03 · Paying in parts"
          title={
            <>
              Pay in bits.
              <br />
              We do the maths.
            </>
          }
          description="Every purchase counts toward the month it was bought in. Once the bill is covered, the rest is logged as extra, never quietly dropped."
        />

        <div data-split="card" className="rounded-3xl bg-card p-6 shadow-xl shadow-ink/5 ring-1 ring-border sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">October bill</p>
              <p className="font-wide text-3xl font-black tabular-nums">{formatNaira(MONTHLY_AMOUNT)}</p>
            </div>
            <span className="grid">
              <span data-split="pending" className="invisible col-start-1 row-start-1 justify-self-end">
                <StatusPill status="PENDING" />
              </span>
              <span data-split="paid" className="col-start-1 row-start-1 justify-self-end">
                <StatusPill status="PAID" />
              </span>
            </span>
          </div>

          {/* The bill: ₦6,000 + ₦4,000 */}
          <div className="mt-6 flex h-12 gap-1 overflow-hidden rounded-xl bg-muted p-1">
            <div
              data-split="seg-0"
              className="flex basis-[60%] origin-left items-center rounded-lg bg-ink px-3 font-mono text-sm text-paper"
            >
              {formatNaira(6000)}
            </div>
            <div
              data-split="seg-1"
              className="flex basis-[40%] origin-left items-center rounded-lg bg-volt px-3 font-mono text-sm text-volt-foreground"
            >
              {formatNaira(4000)}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Extra:</span>
            {[4000, 2000].map((amount, i) => (
              <span
                key={amount}
                data-split={`extra-${i}`}
                className="rounded-full border border-dashed border-ink/30 px-3 py-1 font-mono tabular-nums"
              >
                +{formatNaira(amount)}
              </span>
            ))}
          </div>

          <ol className="mt-7 grid gap-2 border-t border-border pt-6">
            {payments.map(({ paid, toBill, extra, note }, i) => (
              <li
                key={paid}
                data-split="row"
                className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-xl px-3 py-2.5 odd:bg-muted/60"
              >
                <span className="grid size-7 place-items-center rounded-full bg-ink font-mono text-xs text-paper">{i + 1}</span>
                <span>
                  <span className="font-mono font-medium tabular-nums">{formatNaira(paid)}</span>
                  <span className="block text-xs text-muted-foreground sm:inline sm:pl-2">{note}</span>
                </span>
                <span className="text-right font-mono text-xs leading-relaxed tabular-nums">
                  <span className="block">bill {formatNaira(toBill)}</span>
                  <span className="block text-muted-foreground">extra {formatNaira(extra)}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
