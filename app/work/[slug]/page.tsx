import { notFound, permanentRedirect } from "next/navigation";
import { getWork, work } from "@/lib/work";
export function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}
export const dynamicParams = false;
export default async function WorkDetail({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  if (!getWork(slug)) notFound();
  permanentRedirect(`/#project-${slug}`);
}
