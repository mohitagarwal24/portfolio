"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { WorkMeta } from "@/lib/work";
import { WorkCard, type WorkCardData } from "./WorkCard";

const DOMAINS = ["All", "AI", "Quant", "Web3", "Systems", "Web"] as const;
type Domain = (typeof DOMAINS)[number];

export type ArchiveRow = Pick<WorkMeta, "slug" | "code" | "name" | "summary" | "when" | "award" | "domain">;

export function WorkIndex({ featured, archive }: { featured: WorkCardData[]; archive: ArchiveRow[] }) {
  const reduced = useReducedMotion();
  const [domain, setDomain] = useState<Domain>("All");
  const match = (d: WorkMeta["domain"]) => domain === "All" || d.includes(domain);
  const cards = featured.filter((w) => match(w.domain));
  const rows = archive.filter((w) => match(w.domain));

  return (
    <>
      <div role="group" aria-label="Filter by domain" className="mb-10 flex flex-wrap gap-1.5">
        {DOMAINS.map((d) => (
          <button
            key={d}
            aria-pressed={domain === d}
            onClick={() => setDomain(d)}
            className={`relative rounded-full px-4 py-2 font-mono text-[10px] tracking-[0.2em] uppercase transition-colors ${
              domain === d ? "text-void" : "text-muted hover:text-ink"
            }`}
          >
            {domain === d && <motion.span layoutId={reduced ? undefined : "domain-pill"} className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
            <span className="relative">{d}</span>
          </button>
        ))}
      </div>

      <motion.div layout={!reduced} className="grid gap-4 md:grid-cols-2 md:gap-5">
        <AnimatePresence mode="popLayout">
          {cards.map((w, i) => (
            <motion.div
              key={w.slug}
              layout={!reduced}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: reduced ? 1 : 0.98 }}
              transition={{ duration: reduced ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <WorkCard w={w} priority={i < 2} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {rows.length > 0 && (
        <section className="mt-24" aria-label="Archive">
          <h2 className="font-mono text-[11px] tracking-[0.25em] text-muted uppercase">
            Archive <span className="text-ignition">· {rows.length}</span>
          </h2>
          <ul className="mt-6 border-t border-line">
            <AnimatePresence initial={false}>
              {rows.map((w) => (
                <motion.li key={w.slug} layout={!reduced} initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Link
                    href={`/work/${w.slug}`}
                    className="group grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-1 border-b border-line bg-void/30 py-5 backdrop-blur-[2px] transition-colors hover:bg-hull/60 md:grid-cols-[5rem_15rem_1fr_10rem_1.5rem] md:items-baseline md:px-3"
                  >
                    <span className="font-mono text-[11px] tracking-[0.15em] text-ignition">{w.code}</span>
                    <span className="text-lg font-medium tracking-[-0.02em]">{w.name}</span>
                    <span className="col-start-2 text-[15px] text-ink/65 md:col-start-auto">{w.summary}</span>
                    <span className="col-start-2 font-mono text-[10px] tracking-[0.15em] text-muted uppercase md:col-start-auto md:text-right">
                      {w.award ? <span className="text-amber-200">Winner · </span> : null}
                      {w.when.split("·")[0].trim()}
                    </span>
                    <span aria-hidden className="hidden text-muted transition-all duration-500 ease-expo group-hover:translate-x-1 group-hover:text-ignition md:block">
                      →
                    </span>
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </section>
      )}
    </>
  );
}
