import type { Metadata } from "next";
import { PAGE_STOP } from "@/lib/journey";
import { profile } from "@/content/profile";
import { SceneCue } from "@/components/scene/SceneCue";
import { RevealScope } from "@/components/ui/RevealScope";
import { IdBadge } from "@/components/about/IdBadge";
import { Trajectory } from "@/components/sections/Trajectory";
import { Systems } from "@/components/sections/Systems";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About",
  description: "About Mohit Agarwal: background, timeline, skills and awards.",
};

export default function AboutPage() {
  return (
    <>
      <SceneCue stop={PAGE_STOP.about} />
      <div className="mx-auto w-full max-w-[1400px] px-5 pt-36 md:px-10 md:pt-44 lg:pr-36">
        <RevealScope>
          <div className="grid items-start gap-14 lg:grid-cols-[340px_1fr] lg:gap-20">
            <div data-reveal className="lg:sticky lg:top-28">
              <IdBadge />
            </div>
            <div className="-m-5 rounded-sm bg-void/70 p-5 backdrop-blur-sm">
              <div data-reveal className="flex items-center gap-4 font-mono text-[11px] tracking-[0.25em] text-muted uppercase">
                <span className="text-ignition">About</span>
                <span className="h-px w-10 bg-line" />
                <span>Lunar orbit · 384,400 km</span>
              </div>
              <h1 data-reveal className="mt-6 text-5xl leading-[1] font-medium tracking-[-0.045em] md:text-7xl">
                {profile.tagline[0]} <em className="font-serif font-normal tracking-[-0.01em] text-ignition-glow italic">{profile.tagline[1]}</em>
              </h1>
              <div className="mt-10 max-w-2xl space-y-5 text-lg leading-relaxed text-ink/80 md:text-xl md:leading-relaxed">
                {profile.bio.map((p) => (
                  <p data-reveal key={p.slice(0, 24)}>
                    {p}
                  </p>
                ))}
              </div>
              <dl className="mt-14 grid max-w-2xl grid-cols-2 border-t border-l border-line">
                {profile.stats.map((s) => (
                  <div data-reveal key={s.label} className="border-r border-b border-line bg-void/45 p-5 backdrop-blur-[2px]">
                    <dd className="text-3xl font-medium tracking-[-0.04em]">
                      {s.prefix}
                      {s.value.toLocaleString("en-US")}
                      {s.suffix}
                    </dd>
                    <dt className="mt-2 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">{s.label}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </RevealScope>
      </div>
      <Trajectory />
      <Systems />
    </>
  );
}
