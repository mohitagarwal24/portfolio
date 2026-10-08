"use client";

import { useEffect } from "react";
import { journey } from "@/lib/journey";
import { remeasure } from "@/components/SmoothScroll";

/**
 * Tells the shared 3D scene where this page lives. `stop` parks the camera there
 * (the rig flies to it); omit it on the home page to let scroll drive the camera.
 */
export function SceneCue({ stop }: { stop?: number }) {
  useEffect(() => {
    if (stop === undefined) {
      journey.mode = "scroll";
      remeasure();
    } else {
      journey.mode = "fixed";
      journey.index = stop;
    }
  }, [stop]);
  return null;
}
