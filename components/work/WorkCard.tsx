"use client";

import Link from "next/link";
import type { PointerEvent } from "react";
import type { WorkMeta } from "@/lib/work";
import { STATUS_STYLE } from "@/components/ui/MissionPatch";
import { Monitor } from "./Monitor";

export type WorkCardData = Pick<WorkMeta, "slug" | "code" | "name" | "summary" | "when" | "status" | "award" | "stack" | "cover" | "domain">;

function spotlight(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function WorkCard({ w, priority = false }: { w: WorkCardData; priority?: boolean }) {
  return (
    <Link
      href={`/work/${w.slug}`}
      onPointerMove={spotlight}
      className="brackets group relative flex h-full flex-col overflow-hidden border border-line bg-hull/70 p-3 backdrop-blur-md transition-colors duration-500 hover:bg-hull/90 md:p-4"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(520px circle at var(--mx) var(--my), rgb(255 107 26 / 0.10), transparent 45%)" }}
      />
      <Monitor work={w} priority={priority} />
      <div className="relative flex flex-1 flex-col px-2 pt-6 pb-2 md:px-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className={`rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.18em] uppercase ${STATUS_STYLE[w.status]}`}>
            {w.award ?? w.status}
          </span>
          <span className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase">{w.when}</span>
        </div>
        <h3 className="mt-5 flex items-center justify-between gap-4 text-3xl font-medium tracking-[-0.035em]">
          {w.name}
          <span aria-hidden className="text-xl text-muted transition-all duration-500 ease-expo group-hover:translate-x-1 group-hover:text-ignition">
            →
          </span>
        </h3>
        <p className="mt-3 leading-relaxed text-ink/70">{w.summary}</p>
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-6">
          {w.stack.slice(0, 5).map((s) => (
            <li key={s} className="rounded-sm border border-line bg-void/40 px-2 py-1 font-mono text-[10px] tracking-[0.06em] text-ink/70">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
