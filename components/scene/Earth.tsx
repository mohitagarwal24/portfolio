"use client";

import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { AdditiveBlending, BackSide, Mesh, SRGBColorSpace, ShaderMaterial } from "three";
import { atmosphereFragment, atmosphereVertex, earthFragment, earthVertex } from "./shaders";
import { EARTH_R } from "./layout";
import { sunDirection } from "./sun";
import { journey } from "@/lib/journey";

const ATMO_SCALE = 1.045;
// Longitude 78°E (India) faces +z, toward the hero camera.
const START_ROTATION = Math.PI + 0.21;

export function Earth({ hd }: { hd: boolean }) {
  const q = hd ? "4k" : "2k";
  const [day, night, clouds] = useTexture([
    `/textures/earth-day-${q}.webp`,
    `/textures/earth-night-${q}.webp`,
    `/textures/earth-clouds-${q}.webp`,
  ]);
  day.colorSpace = SRGBColorSpace;
  night.colorSpace = SRGBColorSpace;
  for (const t of [day, night, clouds]) t.anisotropy = 8;

  const earth = useRef<Mesh>(null);

  const surface = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: earthVertex,
        fragmentShader: earthFragment,
        uniforms: {
          uDay: { value: day },
          uNight: { value: night },
          uClouds: { value: clouds },
          uSun: { value: sunDirection },
          uCloudShift: { value: 0 },
          uLights: { value: 2.4 },
        },
      }),
    [day, night, clouds],
  );

  const atmosphere = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        uniforms: {
          uSun: { value: sunDirection },
          uIntensity: { value: 1.6 },
          uEdge: { value: Math.sqrt(1 - 1 / (ATMO_SCALE * ATMO_SCALE)) },
        },
        side: BackSide,
        blending: AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );

  useFrame((_, dt) => {
    if (journey.reducedMotion) return;
    if (earth.current) earth.current.rotation.y += dt * 0.006;
    surface.uniforms.uCloudShift.value += dt * 0.0008;
  });

  return (
    <group>
      <mesh ref={earth} material={surface} rotation={[0, START_ROTATION, 0]}>
        <sphereGeometry args={[EARTH_R, 128, 128]} />
      </mesh>
      <mesh material={atmosphere} scale={ATMO_SCALE}>
        <sphereGeometry args={[EARTH_R, 96, 96]} />
      </mesh>
    </group>
  );
}
