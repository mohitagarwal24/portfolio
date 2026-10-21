import type { Metadata } from "next";
import { getWork, work } from "@/lib/work";
import { Portfolio } from "@/components/portfolio/Portfolio";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Home() {
  const projects = work.map(
    ({
      slug,
      name,
      summary,
      when,
      crew,
      domain,
      stack,
      links,
      metrics,
      award,
      gallery,
    }) => ({
      slug,
      name,
      summary,
      when,
      crew,
      domain,
      stack,
      links,
      metrics,
      award,
      gallery,
    }),
  );
  const reports = Object.fromEntries(
    work.map((project) => {
      const { Body } = getWork(project.slug)!;
      return [project.slug, <Body key={project.slug} />];
    }),
  );
  return <Portfolio projects={projects} reports={reports} />;
}
