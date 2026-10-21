import type { MDXComponents } from "mdx/types";
const components: MDXComponents = {
  a: (props) => <a target="_blank" rel="noreferrer" {...props} />,
};
export function useMDXComponents(): MDXComponents {
  return components;
}
