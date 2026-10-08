"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { journey, SCENE_PROGRESS } from "@/lib/journey";
import { lockScroll } from "@/components/SmoothScroll";

export const LAUNCH_EVENT = "ascent:launch";

function launch() {
  if (journey.ready) return;
  journey.ready = true;
  window.dispatchEvent(new Event(LAUNCH_EVENT));
}

export function Preloader() {
  const [{ progress, active, total }, setProgress] = useState({ progress: 0, active: true, total: 0 });
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const started = useRef(0);
  const leaving = useRef(false);

  useEffect(() => {
    started.current = performance.now();
    lockScroll(true);
    window.scrollTo(0, 0);
    const update = (event: Event) => setProgress((event as CustomEvent<{ progress: number; active: boolean; total: number }>).detail);
    window.addEventListener(SCENE_PROGRESS, update);
    const readyFrame = requestAnimationFrame(() => {
      if (journey.sceneReady) setProgress({ progress: 100, active: false, total: 1 });
    });
    // Never hold the visitor hostage: launch anyway after 8s.
    const failsafe = window.setTimeout(() => exit(), 8000);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) exit();
    return () => {
      window.clearTimeout(failsafe);
      cancelAnimationFrame(readyFrame);
      window.removeEventListener(SCENE_PROGRESS, update);
      lockScroll(false);
    };
  }, []);

  const done = total > 0 && !active && progress >= 100;
  useEffect(() => {
    if (!done) return;
    let repeat = false;
    try { repeat = sessionStorage.getItem("ascent-launched") === "1"; } catch {}
    const wait = Math.max(0, (repeat ? 300 : 1400) - (performance.now() - started.current));
    const id = window.setTimeout(exit, wait);
    return () => window.clearTimeout(id);
  }, [done]);

  function exit() {
    if (leaving.current || !root.current) return;
    leaving.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      journey.intro = 1;
      launch();
      setGone(true);
      lockScroll(false);
      return;
    }
    try {
      sessionStorage.setItem("ascent-launched", "1");
    } catch {}
    gsap
      .timeline({
        onComplete: () => {
          setGone(true);
          lockScroll(false);
        },
      })
      .to(root.current.querySelectorAll("[data-pre]"), { opacity: 0, y: -12, duration: 0.5, stagger: 0.05, ease: "power2.in" })
      .add(launch, "-=0.1")
      .to(root.current, { opacity: 0, duration: 1.1, ease: "power2.inOut" }, "<");
  }

  if (gone) return null;

  const pct = Math.round(progress);
  const tMinus = Math.max(0, Math.ceil((100 - pct) / 10));

  return (
    <div
      ref={root}
      data-preloader className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void"
      role="status"
      aria-live="polite"
      aria-label={`Loading ${pct}%`}
    >
      <div data-pre className="font-mono text-[11px] tracking-[0.3em] text-muted uppercase">
        Mission Ascent · Pre-launch
      </div>
      <div data-pre className="mt-6 font-mono text-5xl tabular-nums tracking-tight text-ink md:text-7xl">
        T–00:00:{String(tMinus).padStart(2, "0")}
      </div>
      <div data-pre className="mt-8 h-px w-56 overflow-hidden bg-line md:w-72">
        <div className="h-full bg-ignition transition-[width] duration-300 ease-out" style={{ width: `${pct}%` }} />
      </div>
      <div data-pre className="mt-3 flex w-56 justify-between font-mono text-[10px] tracking-[0.2em] text-muted uppercase md:w-72">
        <span>Loading assets</span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <button
        data-pre
        onClick={exit}
        className="absolute bottom-8 font-mono text-[10px] tracking-[0.3em] text-muted uppercase transition-colors hover:text-ink"
      >
        Skip countdown →
      </button>
    </div>
  );
}
