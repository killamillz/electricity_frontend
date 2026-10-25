import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

// Right-angled traces with rounded corners, like wiring on a board
const traces = [
  "M -20 540 H 250 Q 270 540 270 520 V 400 Q 270 380 290 380 H 610 Q 630 380 630 360 V 170 Q 630 150 650 150 H 1220",
  "M -20 640 H 430 Q 450 640 450 620 V 540 Q 450 520 470 520 H 890 Q 910 520 910 500 V 310 Q 910 290 930 290 H 1220",
  "M 140 -20 V 190 Q 140 210 160 210 H 380 Q 400 210 400 230 V 300",
  "M 1060 720 V 600 Q 1060 580 1080 580 H 1220",
];

const nodes = [
  [400, 300],
  [630, 360],
  [910, 500],
  [270, 520],
  [1060, 600],
];

/** Decorative animated wiring behind the hero */
export function CircuitLines({ className }: { className?: string }) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from("[data-trace='lit']", {
          drawSVG: "0%",
          duration: 2.2,
          ease: "power2.inOut",
          stagger: 0.25,
          delay: 0.4,
        });
        gsap.from("[data-node]", {
          scale: 0,
          transformOrigin: "50% 50%",
          duration: 0.5,
          ease: "back.out(3)",
          stagger: 0.15,
          delay: 1.6,
        });
        // Current pulses travelling along the two long traces
        gsap.utils.toArray<SVGCircleElement>("[data-pulse]").forEach((pulse, i) => {
          const path = scope.current?.querySelector<SVGPathElement>(`[data-trace='lit'][data-index='${i}']`);
          if (!path) return;
          gsap.fromTo(
            pulse,
            { autoAlpha: 1 },
            {
              motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
              duration: 5 + i * 1.5,
              ease: "none",
              repeat: -1,
              delay: 2 + i,
            },
          );
        });
      });
    },
    { scope },
  );

  return (
    <svg
      ref={scope}
      className={cn("pointer-events-none", className)}
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden
    >
      <defs>
        <filter id="pulse-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      {traces.map((d, i) => (
        <path key={`base-${i}`} d={d} stroke="oklch(1 0 0 / 0.06)" strokeWidth="1.5" />
      ))}
      {traces.map((d, i) => (
        <path
          key={`lit-${i}`}
          d={d}
          data-trace="lit"
          data-index={i}
          stroke="var(--volt)"
          strokeOpacity="0.28"
          strokeWidth="1.5"
        />
      ))}
      {nodes.map(([cx, cy]) => (
        <g key={`${cx}-${cy}`} data-node>
          <circle cx={cx} cy={cy} r="5" fill="var(--ink)" stroke="var(--volt)" strokeOpacity="0.6" strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r="1.8" fill="var(--volt)" />
        </g>
      ))}
      {[0, 1].map((i) => (
        <g key={`pulse-${i}`} data-pulse style={{ visibility: "hidden" }}>
          <circle r="7" fill="var(--volt)" filter="url(#pulse-glow)" />
          <circle r="2.5" fill="var(--volt)" />
        </g>
      ))}
    </svg>
  );
}
