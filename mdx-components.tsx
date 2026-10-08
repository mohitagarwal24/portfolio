import type { MDXComponents } from "mdx/types";

// Typography for project write-ups in content/work/*.mdx.
const components: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-14 mb-4 flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] text-ignition uppercase first:mt-0 before:h-px before:w-6 before:bg-ignition/60"
      {...props}
    />
  ),
  h3: (props) => <h3 className="mt-8 mb-3 text-xl font-medium tracking-[-0.02em]" {...props} />,
  p: (props) => <p className="mt-4 text-lg leading-[1.75] text-ink/80" {...props} />,
  ul: (props) => <ul className="mt-4 space-y-2 text-lg leading-[1.7] text-ink/80" {...props} />,
  li: (props) => <li className="relative pl-6 before:absolute before:top-[0.8em] before:left-0 before:size-1 before:rotate-45 before:bg-ignition" {...props} />,
  strong: (props) => <strong className="font-medium text-ink" {...props} />,
  a: (props) => <a className="text-ink underline decoration-ignition/50 underline-offset-4 hover:decoration-ignition" target="_blank" rel="noreferrer" {...props} />,
  code: (props) => <code className="rounded-sm border border-line bg-hull px-1.5 py-0.5 font-mono text-[0.85em]" {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
