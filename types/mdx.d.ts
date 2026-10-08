// Project write-ups in content/work/*.mdx export a `meta` object, validated in lib/work.ts.
declare module "*.mdx" {
  export const meta: unknown;
}
