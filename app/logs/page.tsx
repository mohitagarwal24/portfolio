import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPosts } from "@/lib/posts";
import { PAGE_STOP } from "@/lib/journey";
import { SceneCue } from "@/components/scene/SceneCue";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Logs",
  description: "Notes and write-ups by Mohit Agarwal.",
  alternates: { canonical: "/logs" },
};

export default async function LogsPage() {
  const posts = await getPosts();
  if (!posts.length) notFound();
  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 pt-36 md:px-10 md:pt-44 lg:pr-36">
      <SceneCue stop={PAGE_STOP.logs} />
      <PageHeader eyebrow="Transmissions" title="Notes and" accent="write-ups." />
      <ul className="border-t border-line">
        {posts.map((post) => (
          <li key={post.url} className="border-b border-line py-7">
            <a href={post.url} target="_blank" rel="noreferrer" className="group block">
              <time className="font-mono text-xs text-muted" dateTime={post.date || undefined}>{post.date}</time>
              <h2 className="mt-2 text-2xl group-hover:text-ignition-glow">{post.title} ↗</h2>
              {post.summary && <p className="mt-2 max-w-2xl text-ink/70">{post.summary}</p>}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
