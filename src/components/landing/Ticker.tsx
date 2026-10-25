import { Fragment, useRef } from "react";
import { Zap } from "lucide-react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

const items = [
  "Snap the receipt",
  "Track every month",
  "Spot late months",
  "Extra payments logged",
  "One token, one record",
  "Lagos time",
];

/** Volt band of endlessly scrolling phrases between the hero and the content */
export function Ticker() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.to("[data-ticker='track']", { xPercent: -50, ease: "none", duration: 32, repeat: -1 });
      });
    },
    { scope },
  );

  // Two identical copies side by side; moving by half the width loops seamlessly
  const copy = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <Fragment key={item}>
          <span className="px-6 font-wide text-lg font-extrabold whitespace-nowrap uppercase sm:text-xl">{item}</span>
          <Zap className="size-5 shrink-0" fill="currentColor" strokeWidth={1} aria-hidden />
        </Fragment>
      ))}
    </div>
  );

  return (
    <div ref={scope} className="relative z-10 -mt-px overflow-hidden bg-volt py-4 text-volt-foreground">
      <div data-ticker="track" className="flex w-max">
        {copy(false)}
        {copy(true)}
      </div>
    </div>
  );
}
