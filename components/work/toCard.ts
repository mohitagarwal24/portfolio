import type { WorkMeta } from "@/lib/work";
import type { WorkCardData } from "./WorkCard";
import type { ArchiveRow } from "./WorkIndex";

/** Plain data for client components, so MDX bodies never ship to the browser. */
export const toCard = ({ slug, code, name, summary, when, status, award, stack, cover, domain }: WorkMeta): WorkCardData => ({
  slug,
  code,
  name,
  summary,
  when,
  status,
  award,
  stack,
  cover,
  domain,
});

export const toRow = ({ slug, code, name, summary, when, award, domain }: WorkMeta): ArchiveRow => ({ slug, code, name, summary, when, award, domain });
