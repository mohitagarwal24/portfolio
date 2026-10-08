"use client";

import dynamic from "next/dynamic";
import { Component, useSyncExternalStore, type ReactNode } from "react";
import { reportSceneProgress } from "@/lib/journey";

// WebGL only runs in the browser; the page HTML stays fully server-rendered.
const SpaceCanvas = dynamic(() => import("./SpaceCanvas"), { ssr: false });

// The scene is decorative; a missing GPU or failed texture must not take down the site.
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { reportSceneProgress(100, false, 1); }
  render() { return this.state.failed ? null : this.props.children; }
}

let accelerated: boolean | undefined;
const subscribe = () => () => {};
function canAnimate() {
  if (accelerated !== undefined) return accelerated;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    const debug = gl?.getExtension("WEBGL_debug_renderer_info");
    const renderer = debug ? String(gl?.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : "";
    accelerated = Boolean(gl) && !/swiftshader|llvmpipe|softpipe|software/i.test(renderer);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch { accelerated = false; }
  if (!accelerated) queueMicrotask(() => reportSceneProgress(100, false, 1));
  return accelerated;
}

export function Stage() {
  const animated = useSyncExternalStore(subscribe, canAnimate, () => false);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-void bg-[url('/textures/space-fallback.webp')] bg-cover bg-center">
      {animated && <SceneBoundary><SpaceCanvas /></SceneBoundary>}
    </div>
  );
}
