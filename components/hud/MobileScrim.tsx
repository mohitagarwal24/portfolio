"use client";

import { useEffect, useRef } from "react";
import { journey } from "@/lib/journey";

/** On small screens text sits over the planets, so dim the scene once the hero is left behind. */
export function MobileScrim() {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    let previous = "";
    const loop = () => {
      const opacity = String(Math.min(1, journey.index * 1.6) * 0.5);
      if (el.current && opacity !== previous) el.current.style.opacity = opacity;
      previous = opacity;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <div ref={el} aria-hidden className="pointer-events-none fixed inset-0 -z-[5] bg-void opacity-0 md:hidden" />;
}
