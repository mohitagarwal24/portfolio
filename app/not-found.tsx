import Link from "next/link";
import { PAGE_STOP } from "@/lib/journey";
import { SceneCue } from "@/components/scene/SceneCue";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[1400px] flex-col justify-center px-5 md:px-10">
      <SceneCue stop={PAGE_STOP.lost} />
      <p className="font-mono text-xs tracking-[0.25em] text-muted uppercase">Error 404 · Signal lost</p>
      <h1 className="mt-6 text-6xl leading-tight font-medium tracking-tight md:text-8xl">
        Lost in <em className="font-serif font-normal text-ignition-glow">space.</em>
      </h1>
      <p className="mt-6 max-w-md text-lg text-ink/70">This page doesn&apos;t exist, or it drifted off course.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="rounded-full bg-ignition px-6 py-3 text-void">Return to orbit →</Link>
        <Link href="/work" className="rounded-full border border-white/20 px-6 py-3">See my work</Link>
      </div>
    </div>
  );
}
