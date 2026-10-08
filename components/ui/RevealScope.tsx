"use client";

import { useRef, type ReactNode } from "react";
import { useReveal } from "./primitives";

/** Lets server-rendered pages opt their [data-reveal] children into the scroll reveal. */
export function RevealScope({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  return <div ref={ref}>{children}</div>;
}
