import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";
import { work } from "@/lib/work";
import { getPosts } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const paths = ["", "/work", "/about", ...(posts.length ? ["/logs"] : []), ...work.map((w) => `/work/${w.slug}`)];
  return paths.map((path) => ({ url: `${siteConfig.url}${path}` }));
}
