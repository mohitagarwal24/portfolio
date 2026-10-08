"use client";

import { useId, useMemo, useState } from "react";
import { commendations, constellations, type Constellation } from "@/content/skills";
import { Section, SectionHeader } from "@/components/ui/primitives";

function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

function useStars(c: Constellation) {
  return useMemo(() => {
    const rand = seeded([...c.id].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7) % 2147483647 || 1);
    const n = c.skills.length;
    // Spread stars left to right with vertical jitter so the shape reads as a constellation.
    const stars = c.skills.map((_, i) => ({
      x: 22 + (i / Math.max(1, n - 1)) * 216 + (rand() - 0.5) * 24,
      y: 20 + rand() * 80,
      r: 1.6 + rand() * 1.6,
    }));
    const lines = stars.slice(1).map((s, i) => [stars[i], s] as const);
    if (n > 3) lines.push([stars[0], stars[2]] as const);
    return { stars, lines };
  }, [c]);
}

function ConstellationPanel({ c }: { c: Constellation }) {
  const { stars, lines } = useStars(c);
  const [hover, setHover] = useState<number | null>(null);
  const glow = `glow${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const lit = (i: number) => hover === null || hover === i;

  return (
    <article data-reveal className="brackets group border border-line bg-void/55 p-6 backdrop-blur-sm transition-colors hover:bg-hull/60">
      <div className="flex items-baseline justify-between font-mono text-[10px] tracking-[0.2em] uppercase">
        <span className="text-muted">{c.designation}</span>
        <span className="text-ignition opacity-0 transition-opacity group-hover:opacity-100">● Tracking</span>
      </div>
      <h3 className="mt-2 text-2xl font-medium tracking-[-0.03em]">{c.name}</h3>
      <svg viewBox="0 0 260 120" className="mt-4 w-full" aria-hidden>
        {lines.map(([a, b], i) => (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="currentColor"
            className="text-white/15 transition-colors duration-500 group-hover:text-ignition/50"
            strokeWidth="0.75"
          />
        ))}
        {stars.map((s, i) => (
          <g key={i} className="transition-opacity duration-300" opacity={lit(i) ? 1 : 0.3}>
            <circle cx={s.x} cy={s.y} r={s.r * 4} fill={`url(#${glow})`} opacity={hover === i ? 1 : 0.5} />
            <circle cx={s.x} cy={s.y} r={hover === i ? s.r + 1.2 : s.r} fill={hover === i ? "#ffb37a" : "#e8ecf3"} />
          </g>
        ))}
        <defs>
          <radialGradient id={glow}>
            <stop offset="0" stopColor="#ff6b1a" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ff6b1a" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2" onPointerLeave={() => setHover(null)}>
        {c.skills.map((s, i) => (
          <li
            key={s}
            onPointerEnter={() => setHover(i)}
            className={`cursor-default font-mono text-[11px] tracking-[0.05em] transition-colors ${hover === i ? "text-ignition-glow" : "text-ink/70"}`}
          >
            <span className="text-muted">{String.fromCharCode(945 + i)}</span> {s}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Systems() {
  return (
    <Section id="systems" label="Systems and skills" className="pt-[16vh] pb-[8vh]">
      <SectionHeader index="02" waypoint="Skills and awards" title="What I" accent="work with." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {constellations.map((c) => (
          <ConstellationPanel key={c.id} c={c} />
        ))}
      </div>

      <div className="mt-20">
        <h3 data-reveal className="font-mono text-[11px] tracking-[0.25em] text-muted uppercase">
          Commendations <span className="text-ignition">· {commendations.length}</span>
        </h3>
        <ul className="mt-6 grid grid-cols-1 border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3">
          {commendations.map((c) => (
            <li data-reveal key={c.event} className="border-r border-b border-line bg-void/45 p-5 backdrop-blur-[2px]">
              <div className="text-lg font-medium tracking-[-0.02em]">{c.title}</div>
              <div className="mt-1 text-ink/70">{c.event}</div>
              <div className="mt-3 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">{c.note}</div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
