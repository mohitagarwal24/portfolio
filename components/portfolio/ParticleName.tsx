"use client";

import { useEffect, useRef, useState } from "react";

type Dot = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  size: number;
};
const stageWords = [
  "MOHIT\nAGARWAL",
  "FULL-STACK",
  "WEB3",
  "SYSTEMS",
  "RESEARCH",
];
const colors = ["#292623", "#3b5843", "#934334", "#585067", "#80621c"];
const contactWords = [
  "LET’S BUILD",
  "AI TOOL",
  "WEB APP",
  "SYSTEM",
  "WEBSITE",
  "YOUR IDEA",
];

/** Font-sampled particles share a sticky canvas through the introductory chapters. */
export function ParticleName({
  mode = "stage",
  selection = -1,
}: {
  mode?: "stage" | "contact";
  selection?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selected = useRef(selection);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    selected.current = selection;
    window.dispatchEvent(new Event("particle-selection"));
  }, [selection]);
  useEffect(() => {
    const host = ref.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!host || !canvas || !ctx) return;
    const stage = host.closest<HTMLElement>(".intro-stage");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let dots: Dot[] = [],
      width = 0,
      height = 0,
      raf = 0,
      disposed = false,
      visible = true,
      target = -1,
      cycle = 0;
    let idle = 0;
    const pointer = { x: -1000, y: -1000 };
    const words = mode === "stage" ? stageWords : contactWords;
    const paint = () => {
      raf = 0;
      if (disposed) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle =
        mode === "stage"
          ? colors[Math.max(0, target)]
          : ["#fffffb", "#b9f9d7", "#f6b6cb", "#e3e5fc", "#fae77e", "#dcf79c"][
              Math.max(0, target)
            ];
      let moving = false;
      for (const dot of dots) {
        if (motion.matches) {
          dot.x = dot.tx;
          dot.y = dot.ty;
        } else {
          const dx = dot.x - pointer.x,
            dy = dot.y - pointer.y,
            distance = Math.hypot(dx, dy);
          if (distance > 0 && distance < 110) {
            const force = (1 - distance / 110) * 3.8;
            dot.vx += (dx / distance) * force;
            dot.vy += (dy / distance) * force;
          }
          dot.vx = (dot.vx + (dot.tx - dot.x) * 0.035) * 0.84;
          dot.vy = (dot.vy + (dot.ty - dot.y) * 0.035) * 0.84;
          dot.x += dot.vx;
          dot.y += dot.vy;
          moving ||= Math.abs(dot.vx) + Math.abs(dot.vy) > 0.025;
        }
        ctx.fillRect(dot.x, dot.y, dot.size, dot.size);
      }
      idle = moving ? 0 : idle + 1;
      if (visible && !motion.matches && idle < 3)
        raf = requestAnimationFrame(paint);
    };
    const wake = () => {
      idle = 0;
      if (!raf && visible && !disposed) raf = requestAnimationFrame(paint);
    };
    const sample = (index: number, reset = false) => {
      if (!width || !height) return;
      target = index;
      const source = document.createElement("canvas");
      source.width = width;
      source.height = height;
      const c = source.getContext("2d", { willReadFrequently: true });
      if (!c) return;
      const family = getComputedStyle(host).getPropertyValue("--font-display");
      const lines = words[index].split("\n");
      c.fontStretch = "extra-condensed";
      c.font = `900 100px ${family}`;
      c.fontStretch = "extra-condensed";
      const hero = mode === "stage" && index === 0;
      const mobile = width < 700;
      const maxWidth = hero
        ? width * (mobile ? 0.88 : 0.445)
        : width * (mode === "contact" ? 0.94 : 0.66);
      const maxSize = hero
        ? mobile
          ? width * 0.25
          : width * 0.14
        : mode === "contact"
          ? height * 0.7
          : height * 0.24;
      const size = Math.min(
        maxSize,
        (maxWidth /
          Math.max(...lines.map((line) => c.measureText(line).width))) *
          100,
      );
      c.font = `900 ${size}px ${family}`;
      c.fontStretch = "extra-condensed";
      c.textBaseline = "alphabetic";
      const metrics = c.measureText(lines[0]);
      const glyphHeight =
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      const leading = glyphHeight * 1.19;
      let y = hero
        ? (mobile ? 105 : height * 0.15) + glyphHeight
        : mode === "contact"
          ? (height - glyphHeight) / 2 + glyphHeight
          : height * 0.22 + glyphHeight;
      for (const line of lines) {
        const x = hero
          ? width * (mobile ? 0.052 : 0.0316)
          : (width - c.measureText(line).width) / 2;
        c.fillText(line, x, y);
        y += leading;
      }
      const pixels = c.getImageData(0, 0, width, height).data;
      const step = width < 700 ? 3.4 : 7.2;
      const targets: { x: number; y: number }[] = [];
      for (let y = 0; y < height; y += step)
        for (let x = 0; x < width; x += step) {
          if (pixels[(Math.floor(y) * width + Math.floor(x)) * 4 + 3] > 120)
            targets.push({ x, y });
        }
      const old = dots;
      dots = targets.map((p, i) => {
        const previous = old[i % Math.max(1, old.length)];
        return {
          x:
            reset || motion.matches
              ? p.x
              : (previous?.x ?? p.x + Math.sin(i * 13) * 90),
          y:
            reset || motion.matches
              ? p.y
              : (previous?.y ?? p.y + Math.cos(i * 7) * 70),
          tx: p.x,
          ty: p.y,
          vx: previous?.vx ?? 0,
          vy: previous?.vy ?? 0,
          size: step * 0.52,
        };
      });
      setReady(true);
      idle = 0;
      paint();
    };
    const update = () => {
      const index =
        mode === "stage"
          ? Math.max(
              0,
              Math.min(
                4,
                Math.floor(
                  -(stage?.getBoundingClientRect().top ?? 0) / innerHeight +
                    0.48,
                ),
              ),
            )
          : selected.current >= 0
            ? selected.current + 1
            : cycle;
      if (index !== target) sample(index);
    };
    const resize = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      width = host.clientWidth;
      height = host.clientHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      target = -1;
      update();
    };
    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      wake();
    };
    const leave = () => {
      pointer.x = pointer.y = -1000;
      wake();
    };
    const observer = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) {
        update();
        wake();
      } else {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    const ro = new ResizeObserver(resize);
    void document.fonts.ready.then(() => {
      if (!disposed) {
        resize();
        ro.observe(host);
        observer.observe(host);
      }
    });
    const timer =
      mode === "contact"
        ? setInterval(() => {
            if (visible && !motion.matches && selected.current < 0) {
              cycle = (cycle + 1) % words.length;
              update();
            }
          }, 4400)
        : undefined;
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("particle-selection", update);
    motion.addEventListener("change", resize);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearInterval(timer);
      observer.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("particle-selection", update);
      document.documentElement.removeEventListener("pointerleave", leave);
      motion.removeEventListener("change", resize);
    };
  }, [mode]);
  return (
    <div
      ref={ref}
      className={`particle-surface particle-${mode}`}
      data-ready={ready}
    >
      {mode === "stage" ? (
        <h1 className={ready ? "sr-only" : "particle-fallback"}>
          Mohit
          <br />
          Agarwal
        </h1>
      ) : (
        <h2 className={ready ? "sr-only" : "contact-fallback"}>
          Let&apos;s build
        </h2>
      )}
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
