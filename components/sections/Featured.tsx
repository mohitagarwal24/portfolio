"use client";

import { ButtonGhost, Section, SectionHeader } from "@/components/ui/primitives";
import { WorkCard, type WorkCardData } from "@/components/work/WorkCard";

export function Featured({ work, total }: { work: WorkCardData[]; total: number }) {
  return (
    <Section id="featured" label="Selected work" className="pt-[24vh] pb-[16vh]">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeader index="02" waypoint="Mars orbit · 225M km" title="Selected" accent="work." />
        <div data-reveal className="mb-14 md:mb-20">
          <ButtonGhost href="/work">All {total} projects →</ButtonGhost>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        {work.map((w) => (
          <div data-reveal key={w.slug}>
            <WorkCard w={w} />
          </div>
        ))}
      </div>
    </Section>
  );
}
