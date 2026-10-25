import { useRef } from "react";
import { ScanLine } from "lucide-react";
import { StatusPill } from "@/components/billing/StatusPill";
import { formatNaira } from "@/lib/format";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

const MONTHLY_AMOUNT = 10000;
const FIRST_PAYMENT = 6000;
const TOKEN_GROUPS = ["4821", "0937", "1156", "2280", "7743"];

/**
 * A prepaid meter readout that loops through a month: a token comes in,
 * units count up, the bill fills in two payments and flips from pending to paid.
 * Without motion it shows the finished, paid state.
 */
export function HeroMeter() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const q = gsap.utils.selector(scope);
        const kwhEl = q("[data-meter='kwh']")[0];
        const paidEl = q("[data-meter='paid']")[0];
        const counter = { kwh: 0, paid: 0 };
        const renderKwh = () => (kwhEl.textContent = counter.kwh.toFixed(1));
        const renderPaid = () => (paidEl.textContent = formatNaira(Math.round(counter.paid)));

        gsap.to("[data-meter='badge']", { y: -8, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1 });

        const tl = gsap.timeline({
          repeat: -1,
          repeatDelay: 2.5,
          repeatRefresh: true, // new random units every loop
          delay: 1.4,
          scrollTrigger: {
            trigger: scope.current,
            start: "top bottom",
            end: "bottom top",
            toggleActions: "play pause resume pause",
          },
        });

        tl.set("[data-meter='pending']", { autoAlpha: 1, y: 0 })
          .set("[data-meter='paid-pill']", { autoAlpha: 0 })
          .fromTo("[data-meter='bar']", { scaleX: 0 }, { scaleX: 0, duration: 0 });
        q("[data-meter='group']").forEach((group, i) => {
          tl.to(group, { duration: 0.9, scrambleText: { text: TOKEN_GROUPS[i], chars: "0123456789", speed: 0.5 } }, i * 0.12);
        });
        tl.fromTo(
            counter,
            { kwh: 0 },
            { kwh: () => gsap.utils.random(60, 160, 0.1), duration: 1.4, ease: "power2.out", onUpdate: renderKwh },
            0.2,
          )
          // First payment: part of the bill, still pending
          .fromTo(counter, { paid: 0 }, { paid: FIRST_PAYMENT, duration: 1, ease: "power2.out", onUpdate: renderPaid }, 1.2)
          .to("[data-meter='bar']", { scaleX: FIRST_PAYMENT / MONTHLY_AMOUNT, duration: 1, ease: "power2.out" }, "<")
          // Second payment covers the rest
          .to(counter, { paid: MONTHLY_AMOUNT, duration: 0.9, ease: "power2.inOut", onUpdate: renderPaid }, "+=1")
          .to("[data-meter='bar']", { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, "<")
          .to("[data-meter='pending']", { autoAlpha: 0, y: -6, duration: 0.25 })
          .fromTo("[data-meter='paid-pill']", { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.3 }, "<0.1")
          .fromTo(
            "[data-meter='glow']",
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.25, yoyo: true, repeat: 1, ease: "power1.inOut" },
            "<",
          );
      });
    },
    { scope },
  );

  return (
    <div ref={scope} data-hero="meter" className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="absolute -inset-8 rounded-[3rem] bg-volt/12 blur-3xl" aria-hidden />

      <div
        className="relative rounded-[1.75rem] bg-ink-soft p-5 shadow-2xl ring-1 ring-white/10 sm:p-6"
        role="img"
        aria-label={`Example meter: ${TOKEN_GROUPS.join(" ")} token, October bill of ${formatNaira(MONTHLY_AMOUNT)} paid`}
      >
        <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.2em] text-paper/45 uppercase">
          <span>Meter · 0141</span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-volt shadow-[0_0_8px_var(--volt)]" />
            Live
          </span>
        </div>

        {/* LCD panel */}
        <div className="mt-4 rounded-2xl bg-[oklch(0.15_0.02_120)] p-5 shadow-[inset_0_2px_12px_oklch(0_0_0/0.5)] ring-1 ring-volt/15">
          <p className="font-mono text-[11px] tracking-[0.18em] text-volt/55">UNITS BOUGHT</p>
          <p className="mt-1 flex items-baseline gap-2 font-mono text-volt [text-shadow:0_0_22px_oklch(0.9_0.185_106/0.45)]">
            <span data-meter="kwh" className="text-5xl tabular-nums sm:text-6xl">
              128.4
            </span>
            <span className="text-lg text-volt/65">kWh</span>
          </p>
          <p className="mt-5 font-mono text-[11px] tracking-[0.18em] text-volt/55">TOKEN</p>
          <p className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-lg tracking-wider text-paper/90 tabular-nums sm:text-xl">
            {TOKEN_GROUPS.map((group, i) => (
              <span key={i} data-meter="group">
                {group}
              </span>
            ))}
          </p>
        </div>

        {/* This month's bill */}
        <div className="mt-5 px-1">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-paper/60">October bill</span>
            <span className="font-mono tabular-nums">
              <span data-meter="paid">{formatNaira(MONTHLY_AMOUNT)}</span>
              <span className="text-paper/40"> / {formatNaira(MONTHLY_AMOUNT)}</span>
            </span>
          </div>
          <div className="relative mt-2.5 h-2.5 overflow-hidden rounded-full bg-white/10">
            <div data-meter="bar" className="h-full origin-left rounded-full bg-volt" />
            <div
              data-meter="glow"
              className="invisible absolute inset-0 rounded-full shadow-[0_0_18px_var(--volt)]"
              aria-hidden
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs text-paper/45">Two purchases this month</span>
            <span className="grid">
              <span data-meter="pending" className="invisible col-start-1 row-start-1 justify-self-end">
                <StatusPill status="PENDING" />
              </span>
              <span data-meter="paid-pill" className="col-start-1 row-start-1 justify-self-end">
                <StatusPill status="PAID" />
              </span>
            </span>
          </div>
        </div>
      </div>

      <div
        data-meter="badge"
        className="absolute -bottom-5 -left-2 flex items-center gap-2.5 rounded-2xl bg-paper px-4 py-3 text-ink shadow-xl sm:-left-8"
      >
        <span className="grid size-8 place-items-center rounded-lg bg-volt">
          <ScanLine className="size-4" />
        </span>
        <span className="text-sm leading-tight">
          <span className="block font-semibold">Receipt read</span>
          <span className="text-muted-foreground">You confirm before it saves</span>
        </span>
      </div>
    </div>
  );
}
