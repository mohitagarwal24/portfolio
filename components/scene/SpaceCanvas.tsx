"use client";

import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import { Suspense, useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { reportSceneProgress } from "@/lib/journey";
import { CameraRig } from "./CameraRig";
import { Earth } from "./Earth";
import { AsteroidBelt, Mars, Moon, Nebula, Starfield, SunGlow, SunLight } from "./Bodies";

function detectTier() {
  const small = window.matchMedia("(max-width: 768px)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4;
  return small || (coarse && lowCores) ? "low" : "high";
}

function SceneProgress() {
  const { progress, active, total } = useProgress();
  useEffect(() => reportSceneProgress(progress, active, total), [progress, active, total]);
  return null;
}

export default function SpaceCanvas() {
  const [tier] = useState(detectTier);
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const high = tier === "high";
  const dpr = Math.min(window.devicePixelRatio, high ? 1.75 : 1.5);

  return (
    <Canvas
      frameloop={reduced ? "demand" : "always"}
      className="!fixed inset-0"
      dpr={dpr}
      camera={{ fov: 40, near: 0.1, far: 4000, position: [0, 1.4, 6] }}
      gl={{ antialias: false, powerPreference: "high-performance", stencil: false }}
      flat
    >
      <color attach="background" args={["#020309"]} />
      <ambientLight intensity={0.03} />
      <SceneProgress />
      <SunLight />
      <Nebula />
      <Starfield count={high ? 7000 : 3500} pixelRatio={dpr} />
      <SunGlow />
      <Suspense fallback={null}>
        <Earth hd={high} />
        <Moon />
        <Mars />
      </Suspense>
      <AsteroidBelt count={high ? 700 : 300} />
      <CameraRig />
      <EffectComposer multisampling={high ? 4 : 0}>
        <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.62} luminanceSmoothing={0.25} radius={0.7} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette offset={0.3} darkness={0.7} />
        <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={high ? 0.12 : 0} />
      </EffectComposer>
    </Canvas>
  );
}
