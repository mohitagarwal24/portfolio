"use client";

import { useRef, type ReactNode } from "react";
import { useReveal } from "./primitives";

/** Title block for inner pages: mono eyebrow, display title with a serif accent, optional intro. */
export function PageHeader({ eyebrow, title, accent, children }: { eyebrow: ReactNode; title: string; accent: string; children?: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <header ref={ref} className="mb-16 md:mb-20">
      <div data-reveal className="flex flex-wrap items-center gap-4 font-mono text-[11px] tracking-[0.25em] text-muted uppercase">
        {eyebrow}
      </div>
      <h1 data-reveal className="mt-6 max-w-5xl text-5xl leading-[1] font-medium tracking-[-0.045em] text-balance md:text-7xl lg:text-8xl">
        {title} <em className="font-serif font-normal tracking-[-0.01em] text-ignition-glow italic">{accent}</em>
      </h1>
      {children && (
        <div data-reveal className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/75 md:text-xl">
          {children}
        </div>
      )}
    </header>
  );
}
