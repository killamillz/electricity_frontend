import { useRef } from "react";
import { CircleCheckBig, ScanLine, UserCog, type LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { SectionHeading } from "./SectionHeading";

type Step = { icon: LucideIcon; title: string; body: string };

const steps: Step[] = [
  {
    icon: UserCog,
    title: "Your admin sets a monthly amount",
    body: "Say ₦10,000. That's what each month's bill asks for, starting from the month it's set.",
  },
  {
    icon: ScanLine,
    title: "Buy units, record the purchase",
    body: "Snap the receipt and the amount, token and units are filled in for you. Check them, then save. Or type them in.",
  },
  {
    icon: CircleCheckBig,
    title: "Watch the month turn green",
    body: "Purchases count toward that month's bill. Once it's covered, it's marked paid. Anything above is logged as extra.",
  },
];

export function HowItWorks() {
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
        gsap.from("[data-step]", {
          y: 50,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: { trigger: "[data-steps]", start: "top 80%" },
        });
        // The wire joining the steps fills in as you scroll
        gsap.from("[data-wire]", {
          scaleX: 0,
          ease: "none",
          scrollTrigger: { trigger: "[data-steps]", start: "top 75%", end: "bottom 55%", scrub: 0.6 },
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} id="how" className="scroll-mt-16 py-24 sm:py-32" aria-labelledby="how-title">
      <Container>
        <SectionHeading
          id="how-title"
          eyebrow="01 · How it works"
          title={
            <>
              Three steps.
              <br />
              No spreadsheets.
            </>
          }
        />

        <div data-steps className="relative mt-16">
          <div
            data-wire
            className="absolute top-[3.25rem] right-[16%] left-[16%] hidden h-0.5 origin-left bg-[repeating-linear-gradient(90deg,var(--ink)_0_10px,transparent_10px_18px)] md:block"
            aria-hidden
          />
          <ol className="relative grid gap-6 md:grid-cols-3 md:gap-8">
            {steps.map(({ icon: Icon, title, body }, i) => (
              <li
                key={title}
                data-step
                className="group relative rounded-3xl bg-card p-7 ring-1 ring-border transition-shadow hover:shadow-xl hover:shadow-ink/5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-wide text-6xl leading-none font-black text-transparent [-webkit-text-stroke:1.5px_var(--ink)]">
                    0{i + 1}
                  </span>
                  <span className="relative grid size-12 place-items-center rounded-2xl bg-ink text-volt transition-transform duration-300 group-hover:-rotate-6">
                    <Icon className="size-5" />
                  </span>
                </div>
                <h3 className="mt-8 font-wide text-xl leading-tight font-extrabold">{title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
