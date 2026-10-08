import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWork, work } from "@/lib/work";
import { PAGE_STOP } from "@/lib/journey";
import { SceneCue } from "@/components/scene/SceneCue";
import { Monitor } from "@/components/work/Monitor";
import { Gallery } from "@/components/work/Gallery";
import { MissionPatch, STATUS_STYLE } from "@/components/ui/MissionPatch";
import { RevealScope } from "@/components/ui/RevealScope";

export function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const found = getWork((await params).slug);
  if (!found) return {};
  return {
    title: found.meta.name, description: found.meta.summary,
    alternates: { canonical: `/work/${found.meta.slug}` },
    openGraph: { title: found.meta.name, description: found.meta.summary },
  };
}

const LINK_LABEL = { repo: "GitHub", live: "Live app", video: "Demo video", docs: "Docs" } as const;

export default async function WorkDetail({ params }: PageProps<"/work/[slug]">) {
  const found = getWork((await params).slug);
  if (!found) notFound();
  const { meta: m, Body, prev, next } = found;
  const links = (Object.keys(LINK_LABEL) as (keyof typeof LINK_LABEL)[]).filter((k) => m.links[k]);

  return (
    <article className="mx-auto w-full max-w-[1400px] px-5 pt-32 md:px-10 md:pt-40 lg:pr-36">
      <SceneCue stop={PAGE_STOP.project} />
      <RevealScope>
        <nav data-reveal aria-label="Breadcrumb" className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
          <Link href="/work" className="transition-colors hover:text-ink">
            ← All work
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-ignition">{m.code}</span>
        </nav>

        <header className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div data-reveal className="flex items-center gap-4">
              <MissionPatch code={m.code} className="size-16" />
              <span className={`rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.18em] uppercase ${STATUS_STYLE[m.status]}`}>
                {m.award ?? m.status}
              </span>
            </div>
            <h1 data-reveal className="mt-8 text-5xl leading-[0.98] font-medium tracking-[-0.045em] md:text-7xl lg:text-8xl">
              {m.name}
            </h1>
            <p data-reveal className="mt-6 max-w-3xl text-xl leading-relaxed text-ink/80 md:text-2xl">
              {m.summary}
            </p>
          </div>
          {links.length > 0 && (
            <div data-reveal className="flex flex-wrap gap-2 lg:max-w-xs lg:justify-end">
              {links.map((k, i) => (
                <a
                  key={k}
                  href={m.links[k]}
                  target="_blank"
                  rel="noreferrer"
                  className={`group inline-flex items-center gap-2 rounded-full px-5 py-3 font-mono text-[11px] tracking-[0.18em] uppercase transition-colors ${
                    i === 0 ? "bg-ignition text-void hover:bg-ignition-glow" : "border border-white/15 text-ink hover:border-white/40"
                  }`}
                >
                  {LINK_LABEL[k]}
                  <span className="transition-transform duration-500 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                </a>
              ))}
            </div>
          )}
        </header>

        <dl data-reveal className="mt-14 grid grid-cols-2 border-t border-l border-line md:grid-cols-4">
          {[
            ["When", m.when],
            ["Crew", m.crew],
            ["Domain", m.domain.join(" · ")],
            ["Stack", m.stack.join(" · ")],
          ].map(([k, v]) => (
            <div key={k} className="border-r border-b border-line bg-void/45 p-5 backdrop-blur-[2px]">
              <dt className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">{k}</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-ink">{v}</dd>
            </div>
          ))}
        </dl>

        <div data-reveal className="mt-10">
          <Monitor work={m} priority sizes="(min-width: 1400px) 1200px, 100vw" />
        </div>

        {m.metrics.length > 0 && (
          <dl data-reveal className={`mt-10 grid gap-6 border-b border-line pb-10 ${m.metrics.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
            {m.metrics.map((x) => (
              <div key={x.label}>
                <dd className="text-4xl font-medium tracking-[-0.04em] md:text-6xl">{x.value}</dd>
                <dt className="mt-2 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">{x.label}</dt>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-16 grid gap-12 lg:grid-cols-[14rem_1fr]">
          <div className="hidden font-mono text-[10px] tracking-[0.25em] text-muted uppercase lg:block">
            <div className="sticky top-28">Mission report</div>
          </div>
          <div data-reveal className="max-w-2xl">
            <Body />
          </div>
        </div>

        {m.gallery.length > 0 && (
          <section className="mt-24" aria-label="Gallery">
            <h2 data-reveal className="mb-8 font-mono text-[11px] tracking-[0.25em] text-muted uppercase">
              Gallery <span className="text-ignition">· {m.gallery.length}</span>
            </h2>
            <Gallery shots={m.gallery} name={m.name} />
          </section>
        )}

        <nav aria-label="More projects" className="mt-28 grid border-t border-line md:grid-cols-2">
          {[prev, next].map((w, i) =>
            w ? (
              <Link
                key={w.slug}
                href={`/work/${w.slug}`}
                className={`group flex flex-col gap-2 py-8 transition-colors hover:bg-hull/40 md:px-6 ${i === 1 ? "md:items-end md:border-l md:border-line md:text-right" : ""}`}
              >
                <span className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">{i === 0 ? "← Previous" : "Next →"}</span>
                <span className="text-2xl font-medium tracking-[-0.03em] transition-colors group-hover:text-ignition-glow md:text-3xl">{w.name}</span>
              </Link>
            ) : (
              <span key={i} />
            ),
          )}
        </nav>
      </RevealScope>
    </article>
  );
}
