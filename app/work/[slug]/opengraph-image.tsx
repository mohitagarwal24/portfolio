import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { notFound } from "next/navigation";
import { getWork, work } from "@/lib/work";
import { socialImage } from "@/components/work/SocialImage";

export const alt = "Project by Mohit Agarwal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() { return work.map(({ slug }) => ({ slug })); }

// Read known local images once, without depending on the deployment origin.
const covers = new Map(await Promise.all(work.map(async (project) => {
  const path = "image" in project.cover ? project.cover.image : project.gallery.find((shot) => shot.kind === "screenshot")?.src;
  if (!path) return [project.slug, undefined] as const;
  const png = await sharp(await readFile(join(process.cwd(), "public", path))).resize(720, 840, { fit: "cover", position: "top" }).png().toBuffer();
  return [project.slug, `data:image/png;base64,${png.toString("base64")}`] as const;
})));

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getWork(slug);
  if (!project) notFound();
  return socialImage({ title: project.meta.name, description: project.meta.summary, label: `${project.meta.code} · ${project.meta.domain.join(" / ")}`, image: covers.get(slug) });
}
