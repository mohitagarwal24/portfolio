"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import { siteConfig } from "@/site.config";
import { profile } from "@/content/profile";
import { MissionMark } from "@/components/hud/TopBar";

// Deterministic "barcode" stripes for the badge footer.
const BARS = Array.from({ length: 46 }, (_, i) => ((i * 7919) % 5) + 1);

function Placeholder() {
  return (
    <svg viewBox="0 0 200 250" className="size-full" aria-hidden>
      <rect width="200" height="250" fill="#0b1020" />
      <circle cx="100" cy="98" r="52" fill="none" stroke="#ff6b1a" strokeOpacity="0.55" strokeWidth="2" />
      <path d="M60 98a40 40 0 0 1 80 0v6a40 34 0 0 1-80 0z" fill="#ff6b1a" fillOpacity="0.12" stroke="#ffb37a" strokeOpacity="0.5" />
      <path d="M30 250c4-50 32-78 70-78s66 28 70 78" fill="none" stroke="#e8ecf3" strokeOpacity="0.3" strokeWidth="2" />
      <text x="100" y="232" textAnchor="middle" fill="#8a93a6" fontFamily="var(--font-geist-mono)" fontSize="9" letterSpacing="2">
        PHOTO PENDING
      </text>
    </svg>
  );
}

export function IdBadge() {
  const card = useRef<HTMLDivElement>(null);
  const tilt = (e: PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    if (card.current) card.current.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  };
  const reset = () => card.current && (card.current.style.transform = "");

  return (
    <div className="[perspective:1200px]" onPointerMove={tilt} onPointerLeave={reset}>
      <div
        ref={card}
        className="relative w-full max-w-[340px] overflow-hidden border border-white/15 bg-hull/85 shadow-[0_40px_100px_-30px_rgb(0_0_0/0.9)] backdrop-blur-md transition-transform duration-500 ease-expo will-change-transform"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3 font-mono text-[9px] tracking-[0.25em] text-muted uppercase">
          <span className="flex items-center gap-2 text-ink">
            <MissionMark className="size-4" /> Crew ID
          </span>
          <span>Mission Ascent</span>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden">
          {siteConfig.portrait ? (
            <Image src={siteConfig.portrait} alt={`Portrait of ${siteConfig.name}`} fill sizes="340px" className="object-cover" preload />
          ) : (
            <Placeholder />
          )}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgb(0_0_0/0.18)_0px,rgb(0_0_0/0.18)_1px,transparent_1px,transparent_3px)] opacity-40" />
          <span className="absolute top-3 left-3 rounded-full border border-signal/40 bg-void/60 px-2 py-0.5 font-mono text-[9px] tracking-[0.2em] text-signal uppercase backdrop-blur">
            ● Active
          </span>
        </div>
        <div className="px-4 pt-4 pb-3">
          <div className="text-2xl font-medium tracking-[-0.03em]">{siteConfig.name}</div>
          <div className="mt-1 font-mono text-[10px] tracking-[0.2em] text-ignition uppercase">{profile.title}</div>
          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-3 font-mono text-[9px] tracking-[0.18em] uppercase">
            <div>
              <dt className="text-muted">Base</dt>
              <dd className="mt-1 text-ink">IIT Roorkee</dd>
            </div>
            <div>
              <dt className="text-muted">Discipline</dt>
              <dd className="mt-1 text-ink">Maths & Computing</dd>
            </div>
          </dl>
        </div>
        <div className="flex h-8 items-end gap-[2px] border-t border-line px-4 pb-2" aria-hidden>
          {BARS.map((w, i) => (
            <span key={i} className="h-full bg-white/50" style={{ width: w }} />
          ))}
        </div>
      </div>
    </div>
  );
}
