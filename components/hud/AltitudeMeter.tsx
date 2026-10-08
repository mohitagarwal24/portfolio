"use client";

import { useEffect, useRef, useState } from "react";
import { HOME_WAYPOINTS, journey } from "@/lib/journey";
import { scrollToId } from "@/components/SmoothScroll";

const LAST = HOME_WAYPOINTS.length - 1;

/** Home-page rail: one tick per section, filled as the flight progresses. */
export function AltitudeMeter() {
  const fill = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    let shown = 0;
    let lastActive = -1;
    let prev = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.25, (now - prev) / 1000);
      prev = now;
      shown += (journey.section - shown) * (1 - Math.exp(-dt * 8));
      if (fill.current) fill.current.style.transform = `scaleY(${shown / LAST})`;
      const a = Math.round(journey.section);
      if (a !== lastActive) setActive((lastActive = a));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <nav aria-label="Sections" className="fixed top-1/2 right-6 z-40 hidden h-[40vh] -translate-y-1/2 lg:block xl:right-10">
      <div className="relative h-full w-px bg-line">
        <div ref={fill} className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-ignition/0 via-ignition/50 to-ignition" style={{ transform: "scaleY(0)" }} />
        {HOME_WAYPOINTS.map((w, i) => (
          <button
            key={w.id}
            onClick={() => scrollToId(w.id)}
            className="group absolute right-0 flex translate-x-[5px] -translate-y-1/2 items-center gap-3"
            style={{ top: `${(i / LAST) * 100}%` }}
            aria-label={w.label}
            aria-current={active === i ? "step" : undefined}
          >
            <span
              className={`font-mono text-[10px] tracking-[0.2em] uppercase transition-opacity duration-500 ${
                active === i ? "text-ink opacity-100" : "text-ink opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
              }`}
            >
              {w.label}
            </span>
            <span className={`block size-[9px] rotate-45 border transition-colors duration-500 ${active >= i ? "border-ignition bg-ignition/30" : "border-white/25 bg-void"}`} />
          </button>
        ))}
      </div>
    </nav>
  );
}
