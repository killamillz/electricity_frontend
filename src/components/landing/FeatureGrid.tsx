import { useRef, type ReactNode } from "react";
import { Clock, ShieldCheck, Trophy, CalendarRange, type LucideIcon } from "lucide-react";
import { StatusPill, type BillStatus } from "@/components/billing/StatusPill";
import { Container } from "@/components/layout/Container";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

const months: { month: string; status: BillStatus }[] = [
  { month: "May", status: "PAID" },
  { month: "Jun", status: "PAID" },
  { month: "Jul", status: "LATE" },
  { month: "Aug", status: "PAID" },
  { month: "Sep", status: "PAID" },
  { month: "Oct", status: "PENDING" },
];

const leaders = [
  { name: "Ada", kwh: 182 },
  { name: "Tunde", kwh: 141 },
  { name: "You", kwh: 128 },
  { name: "Kemi", kwh: 96 },
];

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  body: string;
  className?: string;
  children?: ReactNode;
};

function FeatureCard({ icon: Icon, title, body, className, children }: FeatureCardProps) {
  return (
    <article
      data-feature
      className={cn(
        "group flex flex-col rounded-3xl bg-card p-7 ring-1 ring-border transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5",
        className,
      )}
    >
      <span className="grid size-11 place-items-center rounded-xl bg-volt text-volt-foreground transition-transform duration-300 group-hover:rotate-6">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-6 font-wide text-xl font-extrabold">{title}</h3>
      <p className="mt-2 leading-relaxed text-muted-foreground">{body}</p>
      {children}
    </article>
  );
}

export function FeatureGrid() {
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
        gsap.from("[data-feature]", {
          y: 60,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-features]", start: "top 80%" },
        });
        gsap.from("[data-month]", {
          y: 20,
          autoAlpha: 0,
          duration: 0.5,
          ease: "back.out(2)",
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-months]", start: "top 85%" },
        });
        gsap.from("[data-leader-bar]", {
          scaleX: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-leaders]", start: "top 85%" },
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} id="features" className="scroll-mt-16 bg-secondary/60 py-24 sm:py-32" aria-labelledby="features-title">
      <Container>
        <SectionHeading
          id="features-title"
          eyebrow="04 · Features"
          title={
            <>
              The boring bits,
              <br />
              handled.
            </>
          }
        />

        <div data-features className="mt-14 grid gap-5 md:grid-cols-3">
          <FeatureCard
            icon={CalendarRange}
            title="Bills that keep themselves up to date"
            body="A bill appears for every month on your plan, even quiet ones. A past month that was never fully paid is flagged late, so nothing slips."
            className="md:col-span-2"
          >
            <ul data-months className="mt-7 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {months.map(({ month, status }) => (
                <li key={month} data-month className="grid justify-items-center gap-2 rounded-2xl bg-muted/70 px-2 py-3">
                  <span className="font-mono text-xs text-muted-foreground uppercase">{month}</span>
                  <StatusPill status={status} />
                </li>
              ))}
            </ul>
          </FeatureCard>

          <FeatureCard
            icon={Trophy}
            title="A friendly leaderboard"
            body="See who's bought the most units this month and this year."
            className="md:row-span-2"
          >
            <ol data-leaders className="mt-7 grid gap-4">
              {leaders.map(({ name, kwh }, i) => (
                <li key={name} className="grid gap-1.5">
                  <div className="flex justify-between text-sm">
                    <span className={cn(name === "You" && "font-semibold")}>
                      <span className="mr-2 font-mono text-muted-foreground">{i + 1}</span>
                      {name}
                    </span>
                    <span className="font-mono tabular-nums">{kwh} kWh</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      data-leader-bar
                      className={cn("h-full origin-left rounded-full", name === "You" ? "bg-volt" : "bg-ink")}
                      style={{ width: `${(kwh / leaders[0].kwh) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ol>
          </FeatureCard>

          <FeatureCard
            icon={Clock}
            title="Lagos time, always"
            body="A purchase at 00:30 on 1 November counts for November, whatever the server clock says."
          />
          <FeatureCard
            icon={ShieldCheck}
            title="One token, one record"
            body="A token can't be logged twice, and a receipt from last month pays last month's bill."
          />
        </div>
      </Container>
    </section>
  );
}
