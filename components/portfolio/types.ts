import type { WorkMeta } from "@/lib/work";

export type PortfolioProject = Pick<
  WorkMeta,
  | "slug"
  | "name"
  | "summary"
  | "when"
  | "crew"
  | "domain"
  | "stack"
  | "links"
  | "metrics"
  | "award"
  | "gallery"
>;
