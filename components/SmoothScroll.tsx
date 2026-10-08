"use client";

import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { journey, measureSegments, updateFromScroll } from "@/lib/journey";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
const scrollLocks = new Set<string>();
let previousOverflow = "";

/** Scroll to a section id, smoothly when Lenis is running. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 2, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else el.scrollIntoView();
}

export function lockScroll(locked: boolean, owner = "default") {
  if (locked) {
    if (scrollLocks.size === 0) previousOverflow = document.documentElement.style.overflow;
    scrollLocks.add(owner);
  } else {
    if (!scrollLocks.delete(owner)) return;
  }
  if (scrollLocks.size > 0) {
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
  } else {
    lenis?.start();
    document.documentElement.style.overflow = previousOverflow;
  }
}

/** Re-measure home sections and sync the camera; call after layout changes. */
export function remeasure() {
  measureSegments();
  updateFromScroll(window.scrollY);
  ScrollTrigger.refresh();
}

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    journey.reducedMotion = reduced;

    const update = () => updateFromScroll(window.scrollY);

    let tick: ((time: number) => void) | null = null;
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
      if (scrollLocks.size > 0) lenis.stop();
      lenis.on("scroll", () => {
        update();
        ScrollTrigger.update();
      });
      tick = (time) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }
    window.addEventListener("scroll", update, { passive: true });

    const onPointer = (e: PointerEvent) => {
      journey.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      journey.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("pointermove", onPointer);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // New page: start at the top and re-measure once it has laid out.
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
    const id = requestAnimationFrame(remeasure);
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
