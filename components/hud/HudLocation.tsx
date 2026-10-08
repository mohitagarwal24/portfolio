"use client";

import { useEffect, useRef } from "react";
import { STOPS, altitudeAt, formatKm, journey } from "@/lib/journey";

/** Small bottom-left readout: where the camera is and how far from Earth. */
export function HudLocation() {
  const place = useRef<HTMLSpanElement>(null);
  const dist = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    let shown = journey.index;
    let prev = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.25, (now - prev) / 1000);
      prev = now;
      shown += (journey.index - shown) * (journey.reducedMotion ? 1 : 1 - Math.exp(-dt * (journey.mode === "fixed" ? 1.8 : 6)));
      const label = STOPS[Math.round(shown)].label;
      const distance = formatKm(altitudeAt(shown));
      if (place.current && place.current.textContent !== label) place.current.textContent = label;
      if (dist.current && dist.current.textContent !== distance) dist.current.textContent = distance;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      aria-hidden
      className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full border border-line bg-void/70 px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] text-muted uppercase backdrop-blur md:bottom-6 md:left-6"
    >
      <span className="text-ignition">●</span>
      <span ref={place} className="hidden sm:inline" />
      <span className="hidden text-white/20 sm:inline">·</span>
      <span ref={dist} className="text-ink tabular-nums" />
    </div>
  );
}
