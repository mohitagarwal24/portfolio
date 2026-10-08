"use client";

import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { siteConfig } from "@/site.config";
import { profile } from "@/content/profile";
import { useReveal } from "@/components/ui/primitives";
import { MissionMark } from "./TopBar";

/** Contact block + footer, shared by every page. On the home page it is the final, deep-space stop. */
export function Footer() {
  const home = usePathname() === "/";
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  useReveal(ref);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${siteConfig.email}`;
    }
  };

  return (
    <footer
      id="contact"
      ref={ref}
      className={`relative mx-auto flex w-full max-w-[1400px] flex-col px-5 md:px-10 lg:pr-36 ${home ? "min-h-dvh pt-[22vh]" : "pt-40"}`}
    >
      {/* Pinned to Earth on screen by the camera rig when the camera looks back from deep space. */}
      <div id="pale-dot" aria-hidden className="pointer-events-none fixed top-0 left-0 z-0 opacity-0 will-change-transform">
        <div className="absolute top-0 left-0 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" />
        <div className="absolute top-0 left-0 flex translate-x-8 -translate-y-1/2 items-center gap-3 font-mono text-[10px] tracking-[0.22em] whitespace-nowrap text-muted uppercase">
          <span className="h-px w-8 bg-white/30" />
          <span>
            <span className="block text-ink">Earth · you are here</span>
            <span className="block">25.3 billion km away</span>
          </span>
        </div>
      </div>

      <div className="max-w-3xl">
        <div data-reveal className="flex items-center gap-4 font-mono text-[11px] tracking-[0.25em] text-muted uppercase">
          <span className="text-ignition">→</span>
          <span className="h-px w-10 bg-line" />
          <span>Contact</span>
        </div>
        <h2 data-reveal className="mt-6 text-5xl leading-[1.02] font-medium tracking-[-0.04em] md:text-7xl">
          Open a <em className="font-serif font-normal tracking-[-0.01em] text-ignition-glow italic">channel.</em>
        </h2>
        <p data-reveal className="mt-5 text-lg text-ink/70">
          {profile.contactLine}
        </p>

        <div data-reveal className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-2xl font-medium tracking-[-0.03em] break-all underline decoration-ignition/40 decoration-1 underline-offset-[10px] transition-colors hover:decoration-ignition md:text-4xl"
          >
            {siteConfig.email}
          </a>
          <button
            onClick={copy}
            className="w-fit rounded-full border border-white/15 px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-ink uppercase transition-colors hover:border-white/40"
            aria-live="polite"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>

        <ul data-reveal className="mt-14 grid max-w-xl grid-cols-2 border-t border-line">
          {siteConfig.socials.map((s) => (
            <li key={s.label} className="border-b border-line odd:border-r">
              <a href={s.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between p-4 transition-colors hover:bg-hull/60">
                <span>
                  <span className="block font-mono text-[10px] tracking-[0.2em] text-muted uppercase">{s.label}</span>
                  <span className="mt-1 block break-all text-sm text-ink sm:text-base">{s.handle}</span>
                </span>
                <span className="text-muted transition-all duration-500 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ignition">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto flex flex-col gap-4 border-t border-line pt-8 pb-20 font-mono text-[10px] tracking-[0.2em] text-muted uppercase md:mt-32 md:flex-row md:items-center md:justify-between md:pb-8">
        <span className="flex items-center gap-3">
          <MissionMark className="size-5 text-ink" />© 2026 {siteConfig.name} · Built in Roorkee
        </span>
        <span>
          Press <kbd className="rounded border border-line px-1.5 py-0.5 text-ink">⌘K</kbd> to jump anywhere
        </span>
      </div>
    </footer>
  );
}
