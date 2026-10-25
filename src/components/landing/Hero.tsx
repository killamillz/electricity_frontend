import { useRef } from "react";
import { Link } from "react-router";
import { ArrowRight, CalendarCheck, ScanLine, Trophy } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { buttonVariants } from "@/components/ui/button";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { CircuitLines } from "./CircuitLines";
import { HeroMeter } from "./HeroMeter";

const highlights = [
  { icon: ScanLine, label: "Receipt scanning" },
  { icon: CalendarCheck, label: "Monthly bills" },
  { icon: Trophy, label: "Leaderboard" },
];

export function Hero() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.from("[data-hero='eyebrow']", { y: 12, autoAlpha: 0, duration: 0.6 });

        // Re-splits when fonts load or the window resizes, then replays the reveal
        SplitText.create("[data-hero='title']", {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            tl.from(self.lines, { yPercent: 110, duration: 1.1, stagger: 0.12 }, 0.15),
        });

        tl.from("[data-hero='copy']", { y: 20, autoAlpha: 0, duration: 0.8 }, 0.6)
          .from("[data-hero='cta'] > *", { y: 16, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, 0.75)
          .from("[data-hero='highlight']", { autoAlpha: 0, duration: 0.6, stagger: 0.08 }, 0.95)
          .from("[data-hero='meter']", { y: 40, scale: 0.96, autoAlpha: 0, duration: 1.2 }, 0.45);

        // Content drifts up and fades as you scroll past the hero
        gsap.to("[data-hero='content']", {
          yPercent: -12,
          autoAlpha: 0.2,
          ease: "none",
          scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="relative overflow-hidden bg-ink text-paper" aria-labelledby="hero-title">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" aria-hidden />
      <CircuitLines className="absolute inset-0 size-full" />

      <Container
        data-hero="content"
        className="relative grid items-center gap-16 pt-28 pb-24 sm:pt-36 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:pt-40 lg:pb-32"
      >
        <div>
          <p
            data-hero="eyebrow"
            className="inline-flex items-center gap-2.5 rounded-full bg-white/5 px-3.5 py-1.5 text-sm text-paper/80 ring-1 ring-white/10"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-volt opacity-70 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-volt" />
            </span>
            Prepaid electricity, tracked
          </p>

          <h1
            id="hero-title"
            data-hero="title"
            className="mt-7 font-wide text-[clamp(2.6rem,8.5vw,5.75rem)] leading-[0.92] font-black tracking-[-0.025em]"
          >
            Every naira.
            <br />
            Every unit.
            <br />
            <span className="text-volt">Accounted for.</span>
          </h1>

          <p data-hero="copy" className="mt-7 max-w-lg text-lg leading-relaxed text-paper/70">
            Record each token purchase in seconds. Snap the receipt instead of typing, and see at a glance whether
            this month is paid, pending or late.
          </p>

          <div data-hero="cta" className="mt-9 flex flex-wrap gap-3">
            <Link to="/register" className={cn(buttonVariants({ size: "xl" }), "bg-volt text-volt-foreground hover:bg-volt/85")}>
              Get started <ArrowRight />
            </Link>
            <a
              href="#how"
              className={cn(
                buttonVariants({ variant: "outline", size: "xl" }),
                "border-white/20 bg-transparent text-paper hover:bg-white/10 hover:text-paper",
              )}
            >
              See how it works
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-paper/55">
            {highlights.map(({ icon: Icon, label }) => (
              <li key={label} data-hero="highlight" className="flex items-center gap-2">
                <Icon className="size-4 text-volt" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <HeroMeter />
      </Container>
    </section>
  );
}
