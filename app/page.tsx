import type { Metadata } from "next";
import { work } from "@/lib/work";
import { SceneCue } from "@/components/scene/SceneCue";
import { AltitudeMeter } from "@/components/hud/AltitudeMeter";
import { Hero } from "@/components/sections/Hero";
import { HomeIntro } from "@/components/sections/HomeIntro";
import { Featured } from "@/components/sections/Featured";
import { toCard } from "@/components/work/toCard";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  const featured = work.filter((w) => w.home).slice(0, 4).map(toCard);
  return (
    <>
      <SceneCue />
      <AltitudeMeter />
      <Hero />
      <HomeIntro />
      <Featured work={featured} total={work.length} />
    </>
  );
}
