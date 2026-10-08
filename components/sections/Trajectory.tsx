"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { trajectory, type TrajectoryNode } from "@/content/experience";
import { Section, SectionHeader } from "@/components/ui/primitives";

const KIND_LABEL: Record<TrajectoryNode["kind"], string> = {
  work: "Engineering",
  "open-source": "Open source",
  leadership: "Leadership",
  education: "Education",
  honor: "Honor",
};

export function Trajectory() {
  const list = useRef<HTMLDivElement>(null);

  // The orbital path draws itself as you scroll, and each node ignites as the path reaches it.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        "[data-path]",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: list.current, start: "top 70%", end: "bottom 60%", scrub: 0.6 } },
      );
      gsap.utils.toArray<HTMLElement>("[data-node]").forEach((node) => {
        gsap.fromTo(
          node,
          { borderColor: "rgba(255,255,255,0.25)", backgroundColor: "rgba(5,7,13,1)" },
          {
            borderColor: "#ff6b1a",
            backgroundColor: "rgba(255,107,26,0.35)",
            duration: 0.4,
            scrollTrigger: { trigger: node, start: "top 60%", toggleActions: "play none none reverse" },
          },
        );
      });
    },
    { scope: list },
  );

  return (
    <Section id="trajectory" label="Trajectory" className="pt-[16vh] pb-[8vh]">
      <div className="max-w-2xl">
        <SectionHeader index="01" waypoint="Timeline" title="The path" accent="so far." />
      </div>
      <div ref={list} className="relative max-w-2xl">
        <span aria-hidden className="absolute top-2 bottom-2 left-[5px] w-px bg-line" />
        <span aria-hidden data-path className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-gradient-to-b from-ignition to-ignition/30" />
        <ol>
        {trajectory.map((n) => (
          <li key={n.title + n.org} className="relative pb-14 pl-12 last:pb-0">
            <span data-node aria-hidden className="absolute top-1.5 left-0 size-[11px] rotate-45 border bg-void" />
            <div data-reveal>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
                <span className="text-ink">{n.when}</span>
                <span className="h-px w-6 bg-line" />
                <span>{KIND_LABEL[n.kind]}</span>
              </div>
              <h3 className="mt-3 text-2xl font-medium tracking-[-0.025em] md:text-3xl">
                {n.title} <span className="text-muted">· {n.org}</span>
              </h3>
              <p className="mt-3 max-w-xl leading-relaxed text-ink/70">{n.detail}</p>
            </div>
          </li>
        ))}
        </ol>
      </div>
    </Section>
  );
}
