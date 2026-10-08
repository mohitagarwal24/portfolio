"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRef, type ReactNode, type RefObject } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Fades and lifts every [data-reveal] inside `scope` as it scrolls into view. */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      gsap.set(items, { opacity: 0, y: 32 });
      ScrollTrigger.batch(items, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: 0.08, overwrite: true }),
      });
    },
    { scope },
  );
}

export function Section({
  id,
  className = "",
  children,
  label,
}: {
  id: string;
  className?: string;
  children: ReactNode;
  label: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section id={id} ref={ref} aria-label={label} className={`relative mx-auto w-full max-w-[1400px] px-5 md:px-10 lg:pr-36 ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeader({
  index,
  waypoint,
  title,
  accent,
  after = "",
}: {
  index: string;
  waypoint: string;
  title: string;
  accent: string;
  after?: string;
}) {
  return (
    <header className="mb-14 md:mb-20">
      <div data-reveal className="flex items-center gap-4 font-mono text-[11px] tracking-[0.25em] text-muted uppercase">
        <span className="text-ignition">{index}</span>
        <span className="h-px w-10 bg-line" />
        <span>{waypoint}</span>
      </div>
      <h2 data-reveal className="mt-6 max-w-4xl text-4xl leading-[1.04] font-medium tracking-[-0.035em] text-balance md:text-6xl">
        {title} <em className="font-serif font-normal tracking-[-0.01em] text-ignition-glow italic">{accent}</em>
        {after}
      </h2>
    </header>
  );
}

export function ButtonPrimary({ children, onClick, href }: { children: ReactNode; onClick?: () => void; href?: string }) {
  const cls =
    "group inline-flex items-center gap-3 rounded-full bg-ignition px-6 py-3.5 font-mono text-[11px] tracking-[0.2em] text-void uppercase transition-[background-color,box-shadow] duration-300 hover:bg-ignition-glow hover:shadow-[0_0_40px_-6px_var(--color-ignition)]";
  const inner = (
    <>
      {children}
      <span className="transition-transform duration-500 ease-expo group-hover:translate-x-1">→</span>
    </>
  );
  return href ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <button onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function ButtonGhost({ children, onClick, href }: { children: ReactNode; onClick?: () => void; href?: string }) {
  const cls =
    "inline-flex items-center gap-3 rounded-full border border-white/15 bg-void/30 px-6 py-3.5 font-mono text-[11px] tracking-[0.2em] text-ink uppercase backdrop-blur-sm transition-colors duration-300 hover:border-white/40";
  if (href?.startsWith("/"))
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  return href ? (
    <a href={href} className={cls} target="_blank" rel="noreferrer">
      {children}
    </a>
  ) : (
    <button onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

/** Counts up to `value` the first time it scrolls into view. */
export function Counter({ value, decimals = 0, prefix = "", suffix = "" }: { value: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const final = `${prefix}${value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
  useGSAP(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const state = { v: 0 };
    const render = () => {
      el.textContent = `${prefix}${state.v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
    };
    render();
    gsap.to(state, {
      v: value,
      duration: 2.2,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: render,
    });
  });
  return (
    <span ref={ref} className="tabular-nums">
      {final}
    </span>
  );
}
