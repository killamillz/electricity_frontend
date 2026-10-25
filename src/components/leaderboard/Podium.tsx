import { useRef } from "react";
import { Crown } from "lucide-react";
import type { LeaderboardEntry, LeaderboardSort } from "@/api/member";
import { formatNaira } from "@/lib/format";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { entryAmount, nameInitials } from "./utils";

// Visual order 2-1-3, with the winner's block tallest
const places = [
  { index: 1, height: "h-24 sm:h-28", tone: "bg-ink-soft text-paper" },
  { index: 0, height: "h-32 sm:h-40", tone: "bg-volt text-volt-foreground" },
  { index: 2, height: "h-16 sm:h-20", tone: "bg-ink-soft text-paper" },
];

/** Top three payers on blocks of different heights */
export function Podium({ entries, sortBy }: { entries: LeaderboardEntry[]; sortBy: LeaderboardSort }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from("[data-block]", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.8, ease: "power3.out", stagger: 0.1 });
        gsap.from("[data-person]", { y: 20, autoAlpha: 0, duration: 0.6, ease: "back.out(2)", stagger: 0.1, delay: 0.3 });
      });
    },
    { scope, dependencies: [entries, sortBy], revertOnUpdate: true },
  );

  return (
    <div ref={scope} className="relative overflow-hidden rounded-3xl bg-ink px-4 pt-8 text-paper sm:px-8">
      <div className="absolute inset-0 bg-grid" aria-hidden />
      <ol className="relative grid grid-cols-3 items-end gap-2 sm:gap-4">
        {places.map(({ index, height, tone }) => {
          const entry = entries[index];
          return (
            <li key={index} className="flex min-w-0 flex-col items-center">
              {entry ? (
                <div data-person className="mb-3 flex min-w-0 flex-col items-center text-center">
                  {index === 0 && <Crown className="mb-1 size-5 text-volt" fill="currentColor" />}
                  <span
                    className={cn(
                      "grid place-items-center rounded-full font-wide font-bold ring-2",
                      index === 0 ? "size-14 bg-volt text-volt-foreground ring-volt/40" : "size-11 bg-paper text-ink ring-white/20",
                      entry.isMe && "ring-4 ring-paid",
                    )}
                    aria-hidden
                  >
                    {nameInitials(entry.name)}
                  </span>
                  <span className="mt-2 max-w-full truncate text-sm font-medium">
                    {entry.isMe ? "You" : entry.name}
                  </span>
                  <span className="font-mono text-xs text-paper/60 tabular-nums">
                    {formatNaira(entryAmount(entry, sortBy))}
                  </span>
                </div>
              ) : (
                <div className="mb-3 text-xs text-paper/30">—</div>
              )}
              <div
                data-block
                className={cn("grid w-full place-items-start justify-center rounded-t-2xl pt-3", height, tone)}
              >
                <span className="font-wide text-2xl font-black">{entry?.rank ?? index + 1}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
