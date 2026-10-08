"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { CatmullRomCurve3, Matrix4, Quaternion, Vector3 } from "three";
import { journey } from "@/lib/journey";
import { KEYFRAMES, PORTRAIT_TARGETS } from "./layout";
import { sunDirection } from "./sun";

const UP = new Vector3(0, 1, 0);
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function CameraRig() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  const pathname = usePathname();
  const labelEl = useRef<HTMLElement | null>(null);

  // Reduced-motion scenes render only when their camera target or viewport changes.
  useEffect(() => {
    const redraw = () => invalidate();
    const frame = requestAnimationFrame(redraw);
    window.addEventListener("scroll", redraw, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", redraw);
    };
  }, [pathname, invalidate]);

  const portrait = size.width / size.height < 0.8;
  const { curve, rotations } = useMemo(() => {
    const curve = new CatmullRomCurve3(
      KEYFRAMES.map((k) => k.pos),
      false,
      "centripetal",
    );
    const m = new Matrix4();
    const rotations = KEYFRAMES.map((k, i) =>
      new Quaternion().setFromRotationMatrix(m.lookAt(k.pos, portrait ? PORTRAIT_TARGETS[i] : k.target, UP)),
    );
    return { curve, rotations };
  }, [portrait]);

  const s = useRef({ index: 0, px: 0, py: 0 });
  const tmp = useMemo(
    () => ({ pos: new Vector3(), q: new Quaternion(), sun: new Vector3(), offset: new Vector3(), intro: new Vector3(), ndc: new Vector3() }),
    [],
  );

  useFrame((_, dt) => {
    const st = s.current;
    // Page-to-page flights are a little slower than scroll-driven travel.
    const rate = journey.reducedMotion ? 30 : journey.mode === "fixed" ? 1.8 : 3.2;
    const k = journey.reducedMotion ? 1 : 1 - Math.exp(-dt * rate);
    st.index += (journey.index - st.index) * k;
    st.px += (journey.pointer.x - st.px) * (1 - Math.exp(-dt * 2));
    st.py += (journey.pointer.y - st.py) * (1 - Math.exp(-dt * 2));

    const last = KEYFRAMES.length - 1;
    const i = Math.min(last - 1, Math.floor(st.index));
    const t = Math.min(1, Math.max(0, st.index - i));

    // Position along the spline (points are evenly spaced in curve parameter).
    curve.getPoint(Math.min(1, st.index / last), tmp.pos);
    tmp.q.slerpQuaternions(rotations[i], rotations[i + 1], ease(t));
    tmp.sun.lerpVectors(KEYFRAMES[i].sun, KEYFRAMES[i + 1].sun, ease(t)).normalize();

    // Hero intro: drift in from slightly lower and further out while the sun rises.
    const intro = 1 - journey.intro;
    if (st.index < 1) {
      const w = (1 - st.index) * intro;
      tmp.pos.add(tmp.intro.set(0, -0.35 * w, 1.6 * w));
      tmp.sun.y -= 0.32 * intro * (1 - st.index);
      tmp.sun.normalize();
    }

    // Subtle cursor parallax in camera space.
    tmp.offset.set(journey.reducedMotion ? 0 : st.px * 0.12, journey.reducedMotion ? 0 : -st.py * 0.08, 0).applyQuaternion(tmp.q);
    camera.position.copy(tmp.pos).add(tmp.offset);
    camera.quaternion.copy(tmp.q);
    camera.updateMatrixWorld();
    sunDirection.copy(tmp.sun);

    // Pin the "Earth" label to the pale dot once we're in deep space.
    const label = (labelEl.current ??= document.getElementById("pale-dot"));
    if (label) {
      const show = Math.min(1, Math.max(0, (st.index - (last - 0.35)) / 0.3));
      tmp.ndc.set(0, 0, 0).project(camera);
      label.style.opacity = String(show);
      label.style.transform = `translate3d(${((tmp.ndc.x + 1) / 2) * size.width}px, ${((1 - tmp.ndc.y) / 2) * size.height}px, 0)`;
    }
  }, -1);

  return null;
}
