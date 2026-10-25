import { useRef } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { buttonVariants } from "@/components/ui/button";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export function FinalCta() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        // Giant outlined word slides across as the section scrolls by
        gsap.fromTo(
          "[data-cta='word']",
          { xPercent: 10 },
          {
            xPercent: -25,
            ease: "none",
            scrollTrigger: { trigger: scope.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
        gsap.from("[data-cta='content'] > *", {
          y: 30,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: scope.current, start: "top 70%" },
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="relative overflow-hidden bg-ink py-28 text-paper sm:py-36" aria-labelledby="cta-title">
      <p
        data-cta="word"
        className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 font-wide text-[28vw] leading-none font-black whitespace-nowrap text-transparent select-none [-webkit-text-stroke:1px_oklch(1_0_0/0.08)]"
        aria-hidden
      >
        PAID PAID PAID
      </p>
      <Container data-cta="content" className="relative text-center">
        <h2
          id="cta-title"
          className="mx-auto max-w-3xl font-wide text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.95] font-black tracking-[-0.02em]"
        >
          Stop guessing which months you've <span className="text-volt">paid.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-lg text-paper/65">
          Create an account in under a minute. Your admin sets the monthly amount; you record purchases.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/register" className={cn(buttonVariants({ size: "xl" }), "bg-volt text-volt-foreground hover:bg-volt/85")}>
            Create your account <ArrowRight />
          </Link>
          <Link
            to="/login"
            className={cn(
              buttonVariants({ variant: "outline", size: "xl" }),
              "border-white/20 bg-transparent text-paper hover:bg-white/10 hover:text-paper",
            )}
          >
            I already have one
          </Link>
        </div>
      </Container>
    </section>
  );
}
