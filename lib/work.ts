import { z } from "zod";
import { entries } from "@/content/work";

const ART = ["enclave", "attention", "equity", "smile", "memory", "listing", "tiles", "glyphs", "relief", "network", "patch"] as const;
export type ArtKind = (typeof ART)[number];

const link = z.url();

const metaSchema = z.object({
  code: z.string().regex(/^[A-Z]{2}-\d{2}$/, 'like "TL-01"'),
  name: z.string().min(1),
  summary: z.string().min(1).max(220),
  when: z.string().min(1),
  year: z.number().int(),
  crew: z.string().min(1),
  status: z.enum(["Flagship", "Winner", "Shipped", "Research"]),
  award: z.string().optional(),
  domain: z.array(z.enum(["AI", "Quant", "Web3", "Systems", "Web"])).min(1),
  stack: z.array(z.string()).min(1),
  links: z
    .object({ repo: link.optional(), live: link.optional(), video: link.optional(), docs: link.optional() })
    .default({}),
  /** Shown on the home page (keep it to four). */
  home: z.boolean().default(false),
  /** Shown as a large card on /work; others go to the archive list. */
  featured: z.boolean().default(false),
  /** Lower comes first. */
  order: z.number(),
  cover: z.union([z.object({ image: z.string().startsWith("/") }), z.object({ art: z.enum(ART) })]),
  metrics: z.array(z.object({ value: z.string(), label: z.string() })).max(3).default([]),
  gallery: z
    .array(z.object({ src: z.string().startsWith("/"), caption: z.string(), kind: z.enum(["screenshot", "diagram"]).default("screenshot") }))
    .default([]),
});

export type WorkMeta = z.infer<typeof metaSchema> & { slug: string };

function load(): WorkMeta[] {
  return Object.entries(entries)
    .map(([slug, mod]) => {
      const parsed = metaSchema.safeParse(mod.meta);
      if (!parsed.success) {
        const issues = parsed.error.issues.map((i) => `  • ${i.path.join(".") || "meta"}: ${i.message}`).join("\n");
        throw new Error(`Invalid \`meta\` in content/work/${slug}.mdx\n${issues}`);
      }
      return { ...parsed.data, slug };
    })
    .sort((a, b) => a.order - b.order);
}

/** All projects, validated and sorted. Server-only (imports the MDX modules). */
export const work = load();

export function getWork(slug: string) {
  const i = work.findIndex((w) => w.slug === slug);
  if (i < 0) return null;
  return { meta: work[i], Body: entries[slug as keyof typeof entries].default, prev: work[i - 1] ?? null, next: work[i + 1] ?? null };
}
