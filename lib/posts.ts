import { siteConfig } from "@/site.config";

export type Post = { title: string; url: string; date: string; summary: string };

const decode = (s: string) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

const tag = (xml: string, name: string) => decode(xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))?.[1] ?? "");

async function fromRss(feedUrl: string): Promise<Post[]> {
  try {
    const response = await fetch(feedUrl, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) });
    if (!response.ok) return [];
    const xml = await response.text();
    return [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/g)].flatMap(([, item]) => {
      const title = tag(item, "title");
      const url = tag(item, "link");
      if (!title || !URL.canParse(url) || !["https:", "http:"].includes(new URL(url).protocol)) return [];
      const date = new Date(tag(item, "pubDate"));
      return [{ title, url, date: Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10), summary: tag(item, "description").slice(0, 200) }];
    });
  } catch {
    return [];
  }
}

/**
 * Posts from whichever source is set in site.config.ts (Medium and Substack both
 * publish RSS). Returns [] when blogging is off, which hides /logs everywhere.
 */
export async function getPosts(): Promise<Post[]> {
  const blog = siteConfig.blog;
  if (blog.kind === "rss") return fromRss(blog.feedUrl);
  return [];
}
