import type { Metadata } from "next";
import { work } from "@/lib/work";
import { PAGE_STOP } from "@/lib/journey";
import { profile } from "@/content/profile";
import { SceneCue } from "@/components/scene/SceneCue";
import { PageHeader } from "@/components/ui/PageHeader";
import { WorkIndex } from "@/components/work/WorkIndex";
import { toCard, toRow } from "@/components/work/toCard";

export const metadata: Metadata = {
  alternates: { canonical: "/work" },
  title: "Work",
  description: "Projects by Mohit Agarwal across AI, quant, Web3, systems and the web, with code and live demos.",
};

export default function WorkPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 pt-36 md:px-10 md:pt-44">
      <SceneCue stop={PAGE_STOP.work} />
      <PageHeader
        eyebrow={
          <>
            <span className="text-ignition">{String(work.length).padStart(2, "0")}</span>
            <span className="h-px w-10 bg-line" />
            <span>Mission log · Mars orbit</span>
          </>
        }
        title="Things I've"
        accent="built."
      >
        {profile.workIntro}
      </PageHeader>
      <WorkIndex featured={work.filter((w) => w.featured).map(toCard)} archive={work.filter((w) => !w.featured).map(toRow)} />
    </div>
  );
}
