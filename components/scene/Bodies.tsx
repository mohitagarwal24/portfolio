"use client";

import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  DynamicDrawUsage,
  IcosahedronGeometry,
  InstancedMesh,
  Mesh,
  Object3D,
  SRGBColorSpace,
  ShaderMaterial,
  Vector3,
} from "three";
import { journey } from "@/lib/journey";
import { BELT, MARS, MOON } from "./layout";
import { sunDirection } from "./sun";
import { nebulaFragment, nebulaVertex, starFragment, starVertex, sunFragment, sunVertex } from "./shaders";

/** Directional light that follows the live sun direction. */
export function SunLight() {
  const light = useRef<DirectionalLight>(null);
  useFrame(({ camera }) => {
    if (!light.current) return;
    light.current.position.copy(camera.position).addScaledVector(sunDirection, 100);
    light.current.target.position.copy(camera.position);
    light.current.target.updateMatrixWorld();
  });
  return <directionalLight ref={light} intensity={3.2} color="#fff4e6" />;
}

/** The sun as a billboard glow at infinity in the sun's direction. */
export function SunGlow() {
  const mesh = useRef<Mesh>(null);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: sunVertex,
        fragmentShader: sunFragment,
        uniforms: { uIntensity: { value: 1 } },
        blending: AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );
  useFrame(({ camera }) => {
    if (!mesh.current) return;
    mesh.current.position.copy(camera.position).addScaledVector(sunDirection, 900);
    mesh.current.quaternion.copy(camera.quaternion);
    // From interstellar space the sun is just the brightest star.
    const far = Math.min(1, Math.max(0, journey.index - 4));
    mesh.current.scale.setScalar(1 - far * 0.8);
  });
  return (
    <mesh ref={mesh} material={material} renderOrder={-1}>
      <planeGeometry args={[260, 260]} />
    </mesh>
  );
}

export function Moon() {
  const map = useTexture("/textures/moon-2k.webp");
  map.colorSpace = SRGBColorSpace;
  const mesh = useRef<Mesh>(null);
  useFrame(({ camera }, dt) => {
    if (!mesh.current) return;
    if (!journey.reducedMotion) mesh.current.rotation.y += dt * 0.01;
    mesh.current.visible = camera.position.z > -205; // invisible from interstellar distance
  });
  return (
    <mesh ref={mesh} position={MOON.position}>
      <sphereGeometry args={[MOON.radius, 96, 96]} />
      <meshStandardMaterial map={map} roughness={1} metalness={0} />
    </mesh>
  );
}

export function Mars() {
  const map = useTexture("/textures/mars-2k.webp");
  map.colorSpace = SRGBColorSpace;
  const mesh = useRef<Mesh>(null);
  useFrame(({ camera }, dt) => {
    if (!mesh.current) return;
    if (!journey.reducedMotion) mesh.current.rotation.y += dt * 0.012;
    mesh.current.visible = camera.position.z > -205;
  });
  return (
    <mesh ref={mesh} position={MARS.position} rotation={[0.44, 0, 0]}>
      <sphereGeometry args={[MARS.radius, 96, 96]} />
      <meshStandardMaterial map={map} roughness={0.95} metalness={0} />
    </mesh>
  );
}

// Deterministic PRNG so the sky is the same on every visit.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STAR_TINTS = ["#9db4ff", "#cad7ff", "#f8f7ff", "#fff4e8", "#ffd2a1", "#ffb56c"].map((c) => new Color(c));

export function Starfield({ count, pixelRatio }: { count: number; pixelRatio: number }) {
  const { geometry, material } = useMemo(() => {
    const rand = mulberry32(7);
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const seeds = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const dir = new Vector3();
    for (let i = 0; i < count; i++) {
      // Shell around the whole route so stars never pass the camera.
      dir.set(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1).normalize();
      const r = 700 + rand() * 500;
      positions.set([dir.x * r, dir.y * r, dir.z * r - 120], i * 3);
      const bright = Math.pow(rand(), 9);
      sizes[i] = 1.1 + bright * 5.5;
      seeds[i] = rand();
      const tint = STAR_TINTS[Math.floor(Math.pow(rand(), 1.4) * STAR_TINTS.length)];
      const lum = 0.45 + bright * 2.6;
      colors.set([tint.r * lum, tint.g * lum, tint.b * lum], i * 3);
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new BufferAttribute(sizes, 1));
    geometry.setAttribute("aSeed", new BufferAttribute(seeds, 1));
    geometry.setAttribute("aColor", new BufferAttribute(colors, 3));
    const material = new ShaderMaterial({
      vertexShader: starVertex,
      fragmentShader: starFragment,
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: pixelRatio } },
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
    return { geometry, material };
  }, [count, pixelRatio]);

  useFrame(({ clock }) => {
    if (!journey.reducedMotion) material.uniforms.uTime.value = clock.elapsedTime;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

export function Nebula() {
  const material = useMemo(
    () => new ShaderMaterial({ vertexShader: nebulaVertex, fragmentShader: nebulaFragment, side: 1, depthWrite: false }),
    [],
  );
  const mesh = useRef<Mesh>(null);
  useFrame(({ camera }) => mesh.current?.position.copy(camera.position));
  return (
    <mesh ref={mesh} material={material} renderOrder={-2} frustumCulled={false}>
      <sphereGeometry args={[1500, 48, 32]} />
    </mesh>
  );
}

function smooth(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function AsteroidBelt({ count }: { count: number }) {
  const mesh = useRef<InstancedMesh>(null);

  const { geometry, rocks } = useMemo(() => {
    const rand = mulberry32(42);
    // A lumpy rock: jitter every vertex of an icosphere along its normal.
    const geometry = new IcosahedronGeometry(1, 2);
    const pos = geometry.attributes.position;
    const seen = new Map<string, number>();
    for (let i = 0; i < pos.count; i++) {
      const key = `${pos.getX(i).toFixed(3)},${pos.getY(i).toFixed(3)},${pos.getZ(i).toFixed(3)}`;
      let k = seen.get(key);
      if (k === undefined) {
        k = 0.72 + rand() * 0.45;
        seen.set(key, k);
      }
      pos.setXYZ(i, pos.getX(i) * k, pos.getY(i) * k * 0.82, pos.getZ(i) * k);
    }
    geometry.computeVertexNormals();

    const rocks = [];
    while (rocks.length < count) {
      const x = (rand() * 2 - 1) * 70;
      const y = (rand() + rand() + rand() - 1.5) * 9;
      const z = BELT.center.z + (rand() * 2 - 1) * BELT.depth * 0.5;
      // Keep a clear corridor along the camera's route.
      // Keep a clear corridor along the camera's route; big rocks stay out wide.
      const side = Math.abs(x);
      if (side < 5 && Math.abs(y) < 3) continue;
      const big = Math.pow(rand(), 3.2);
      if (big > 0.25 && side < 14) continue;
      rocks.push({
        position: new Vector3(x, y, z),
        scale: 0.05 + big * 1.1,
        rotation: new Vector3(rand() * 6.28, rand() * 6.28, rand() * 6.28),
        spin: new Vector3((rand() - 0.5) * 0.3, (rand() - 0.5) * 0.3, (rand() - 0.5) * 0.3),
      });
    }
    return { geometry, rocks };
  }, [count]);

  const dummy = useMemo(() => new Object3D(), []);
  useFrame(({ camera }, dt) => {
    const m = mesh.current;
    if (!m) return;
    // Only exists around the belt: grows in after Mars, gone again in deep space.
    const z = camera.position.z;
    const w = smooth(-95, -120, z) * (1 - smooth(-200, -225, z));
    m.visible = w > 0.001;
    if (!m.visible) return;
    rocks.forEach((r, i) => {
      if (!journey.reducedMotion) r.rotation.addScaledVector(r.spin, dt);
      dummy.position.copy(r.position);
      dummy.rotation.set(r.rotation.x, r.rotation.y, r.rotation.z);
      dummy.scale.setScalar(r.scale * w);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={(m) => {
        mesh.current = m;
        m?.instanceMatrix.setUsage(DynamicDrawUsage);
      }}
      args={[geometry, undefined, count]}
      frustumCulled={false}
    >
      <meshStandardMaterial color="#7a6d62" roughness={0.95} metalness={0.05} flatShading />
    </instancedMesh>
  );
}
