"use client";

import { profile } from "@/content/profile";
import Image from "next/image";
import { siteConfig } from "@/site.config";
import { ButtonGhost, Counter, Section, SectionHeader } from "@/components/ui/primitives";

export function HomeIntro() {
  return (
    <Section id="intro" label="Introduction" className="pt-[24vh] pb-[16vh]">
      <div className="max-w-3xl">
        <SectionHeader index="01" waypoint="GEO · 35,786 km" title="Hi, I'm" accent="Mohit." />
        <div className={`grid items-start gap-8 ${siteConfig.portrait ? "md:grid-cols-[240px_minmax(0,1fr)]" : ""}`}>
          {siteConfig.portrait && (
            <figure data-reveal className="brackets w-40 border border-white/15 bg-hull/85 shadow-[0_20px_60px_-30px_rgb(0_0_0/0.8)] md:w-full">
              <figcaption className="flex items-center justify-between border-b border-line px-3 py-2.5 font-mono text-[9px] tracking-[0.18em] text-muted uppercase">
                <span>Crew / <span className="text-ignition-glow">MA-01</span></span>
                <span aria-hidden className="size-1.5 rounded-full bg-signal" />
              </figcaption>
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src={siteConfig.portrait} alt={`Portrait of ${siteConfig.name}`} fill sizes="(min-width: 768px) 240px, 160px" className="object-cover" />
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgb(0_0_0/0.18)_0px,rgb(0_0_0/0.18)_1px,transparent_1px,transparent_3px)] opacity-20" />
              </div>
            </figure>
          )}
          <div>
            <p data-reveal className="text-xl leading-relaxed text-ink/85 md:text-2xl md:leading-relaxed">
              {profile.homeIntro}
            </p>
            <div data-reveal className="mt-8">
              <ButtonGhost href="/about">More about me →</ButtonGhost>
            </div>
          </div>
        </div>
      </div>

      <dl className="mt-20 grid max-w-3xl grid-cols-2 border-t border-l border-line md:grid-cols-4">
        {profile.stats.map((s, i) => (
          <div data-reveal key={s.label} className="hud-grid border-r border-b border-line bg-void/45 p-5 backdrop-blur-[2px] md:p-6">
            <dt className="font-mono text-[10px] leading-relaxed tracking-[0.18em] text-muted uppercase">
              <span className="text-ignition">T{String(i + 1).padStart(2, "0")}</span> · {s.label}
            </dt>
            <dd className="mt-4 text-4xl font-medium tracking-[-0.04em]">
              <Counter value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
