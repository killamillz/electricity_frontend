import { useRef, type ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { StatusPill } from "@/components/billing/StatusPill";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { formatNaira } from "@/lib/format";

type AuthShellProps = {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  /** Below the form, e.g. "No account? Register" */
  footer?: ReactNode;
};

const recentMonths = [
  { month: "August", amount: 10000, status: "PAID" },
  { month: "September", amount: 10000, status: "PAID" },
  { month: "October", amount: 6000, status: "PENDING" },
] as const;

/** Shared layout for login, register and password pages */
export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from("[data-animate='form'] > *", {
          y: 16,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.06,
        });
        gsap.from("[data-animate='month']", {
          x: -24,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.2,
        });
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className="grid min-h-svh lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-ink text-paper lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 bg-grid" aria-hidden />
        <div className="absolute -right-24 -bottom-24 size-96 rounded-full bg-volt/20 blur-3xl" aria-hidden />

        <Logo tone="light" className="relative" />

        <div className="relative">
          <p className="font-wide text-5xl leading-[0.95] font-black tracking-tight xl:text-6xl">
            Know where
            <br />
            every <span className="text-volt">naira</span>
            <br />
            went.
          </p>
          <ul className="mt-10 grid max-w-sm gap-2.5">
            {recentMonths.map(({ month, amount, status }) => (
              <li
                key={month}
                data-animate="month"
                className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10"
              >
                <span className="text-sm text-paper/70">{month}</span>
                <span className="flex items-center gap-3">
                  <span className="font-mono text-sm tabular-nums">{formatNaira(amount)}</span>
                  <StatusPill status={status} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-paper/50">Prepaid electricity, tracked month by month.</p>
      </aside>

      <main className="flex flex-col px-4 py-8 sm:px-8">
        <Logo className="lg:hidden" />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <div data-animate="form" className="grid gap-6">
            <header className="grid gap-2">
              <h1 className="font-wide text-3xl font-extrabold tracking-tight">{title}</h1>
              {description && <p className="text-muted-foreground">{description}</p>}
            </header>
            {children}
            {footer && <div className="text-center text-sm text-muted-foreground">{footer}</div>}
          </div>
        </div>
      </main>
    </div>
  );
}
