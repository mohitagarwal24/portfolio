"use client";

import Image from "next/image";
import {
  ArrowCounterClockwiseIcon,
  PlayIcon,
  ArrowUpRightIcon,
} from "@phosphor-icons/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import type Matter from "matter-js";
import type { PortfolioProject } from "./types";

type Physics = {
  matter: typeof Matter;
  engine: Matter.Engine;
  bodies: Matter.Body[];
  width: number;
  height: number;
  wake: () => void;
  absorb: (index: number) => void;
  launch: (index: number) => void;
};
const slugs = [
  "gitcraft",
  "tradelayer",
  "llm-tracing",
  "nifty-intelligence",
  "citadel",
  "resq",
  "chainlance",
  "nexus",
];
const labels = [
  "GitCraft",
  "TradeLayer",
  "LLM Tracing",
  "NIFTY Intelligence",
  "Citadel",
  "ResQ",
  "ChainLance",
  "Nexus",
  "FULL-STACK",
  "AI & ML",
  "SYSTEMS",
  "DATA & QUANT",
];
const colors = ["pink", "mint", "yellow", "lavender"];
const startX = (index: number) =>
  index < slugs.length
    ? (index * 0.61803398875 + 0.17) % 1
    : [0.38, 0.06, 0.66, 0.94][index - slugs.length];

export function ProjectPlayground({
  projects,
  onOpen,
}: {
  projects: PortfolioProject[];
  onOpen: (slug: string) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const physics = useRef<Physics | null>(null);
  const drag = useRef<{
    index: number;
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    time: number;
    vx: number;
    vy: number;
    moved: boolean;
  } | null>(null);
  const intakeRef = useRef<HTMLDivElement>(null);
  const buildRef = useRef<(index: number) => void>(() => {});
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeProject, setActiveProject] = useState("gitcraft");
  const [buildState, setBuildState] = useState<"idle" | "building" | "ready">(
    "idle",
  );
  const [progress, setProgress] = useState(0);
  const [reset, setReset] = useState(0);
  const [reduced, setReduced] = useState(false);
  const project = projects.find((p) => p.slug === activeProject);
  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );
  const build = useCallback(
    (index = 0) => {
      if (index >= slugs.length) return;
      if (timer.current) clearInterval(timer.current);
      setActiveProject(slugs[index]);
      if (reduced) {
        setProgress(100);
        setBuildState("ready");
        return;
      }
      setProgress(0);
      setBuildState("building");
      let value = 0;
      timer.current = setInterval(() => {
        value = Math.min(100, value + 10);
        setProgress(value);
        if (value === 100) {
          clearInterval(timer.current!);
          timer.current = null;
          setBuildState("ready");
        }
      }, 85);
    },
    [reduced],
  );
  useEffect(() => {
    buildRef.current = build;
  }, [build]);
  const launch = (index = 0) => {
    if (physics.current) physics.current.launch(index);
    else build(index);
  };
  const isOverIntake = (x: number, y: number) => {
    const box = intakeRef.current?.getBoundingClientRect();
    return (
      !!box &&
      x >= box.left - 20 &&
      x <= box.right + 20 &&
      y >= box.top - 20 &&
      y <= box.bottom + 100
    );
  };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let raf = 0;
    let visible = true;
    let last = 0;
    let idle = 0;
    let cleanup: (() => void) | undefined;
    let generation = 0;
    const mobile = window.matchMedia("(max-width: 700px)");
    const init = async () => {
      const version = ++generation;
      cleanup?.();
      cleanup = undefined;
      drag.current = null;
      cancelAnimationFrame(raf);
      physics.current = null;
      pillRefs.current.forEach((el) => {
        if (!el) return;
        el.hidden = false;
        el.style.opacity = "";
        delete el.dataset.absorbing;
        delete el.dataset.dragged;
        delete el.dataset.dragging;
      });
      setReduced(motion.matches);
      if (motion.matches || mobile.matches) {
        host.dataset.physics = "false";
        pillRefs.current.forEach((el) => {
          if (el) el.style.transform = "";
        });
        return;
      }
      await document.fonts.ready;
      const mod = await import("matter-js");
      if (disposed || version !== generation) return;
      const m = mod.default;
      host.dataset.physics = "true";
      const width = host.clientWidth;
      const height = host.clientHeight;
      const engine = m.Engine.create({ enableSleeping: true });
      engine.gravity.y = 1;
      const sizes = pillRefs.current.map((element) => ({
        w: element?.offsetWidth ?? 150,
        h: element?.offsetHeight ?? 58,
      }));
      const bodies = sizes.map(({ w, h }, i) => {
        const x = Math.max(
          w / 2 + 12,
          Math.min(width - w / 2 - 12, startX(i) * width),
        );
        const b =
          i >= slugs.length
            ? m.Bodies.circle(
                x,
                height - 280 - (i - slugs.length) * 30,
                h / 2 + 5,
                {
                  restitution: 0.45,
                  friction: 0.1,
                  frictionAir: 0.025,
                },
              )
            : m.Bodies.rectangle(
                x,
                height - 260 - Math.floor(i / 6) * 64,
                w + 10,
                h + 10,
                {
                  chamfer: { radius: h / 2 - 2 },
                  restitution: 0.45,
                  friction: 0.15,
                  frictionAir: 0.025,
                },
              );
        m.Body.setAngle(b, Math.sin(i * 23) * 0.22);
        return b;
      });
      m.Composite.add(engine.world, [
        ...bodies,
        m.Bodies.rectangle(width / 2, height - 16, width + 100, 60, {
          isStatic: true,
        }),
        m.Bodies.rectangle(-12, height / 2, 60, height * 3, { isStatic: true }),
        m.Bodies.rectangle(width + 12, height / 2, 60, height * 3, {
          isStatic: true,
        }),
      ]);
      const hostBox = host.getBoundingClientRect();
      const intakeBox = intakeRef.current!.getBoundingClientRect();
      const mouth = {
        x: intakeBox.left - hostBox.left + intakeBox.width / 2,
        y: intakeBox.top - hostBox.top + intakeBox.height / 2,
        halfWidth: intakeBox.width / 2,
      };
      const previousY = bodies.map((body) => body.position.y);
      const absorbed = new Set<number>();
      const swallowing = new Map<
        number,
        { start: number; x: number; y: number; angle: number }
      >();
      const absorb = (index: number) => {
        if (index >= slugs.length || absorbed.has(index)) return;
        const body = bodies[index];
        const el = pillRefs.current[index];
        absorbed.add(index);
        swallowing.set(index, {
          start: performance.now(),
          x: body.position.x,
          y: body.position.y,
          angle: body.angle,
        });
        m.Body.setStatic(body, true);
        m.Composite.remove(engine.world, body);
        if (el) {
          el.dataset.absorbing = "true";
          if (document.activeElement === el) el.blur();
        }
        buildRef.current(index);
        wake();
      };
      const launch = (index: number) => {
        if (index >= slugs.length) return;
        const body = bodies[index];
        const el = pillRefs.current[index];
        if (absorbed.delete(index)) m.Composite.add(engine.world, body);
        swallowing.delete(index);
        if (el) {
          el.hidden = false;
          el.style.opacity = "";
          delete el.dataset.absorbing;
        }
        m.Body.setStatic(body, false);
        m.Sleeping.set(body, false);
        m.Body.setPosition(body, { x: mouth.x, y: mouth.y - 155 });
        m.Body.setAngle(body, 0);
        m.Body.setAngularVelocity(body, 0);
        m.Body.setVelocity(body, { x: 0, y: 2.5 });
        previousY[index] = body.position.y;
        wake();
      };
      let running = false;
      const tick = (now: number) => {
        raf = 0;
        if (disposed || !visible) {
          running = false;
          return;
        }
        const delta = last ? Math.min(now - last, 1000 / 60) : 1000 / 60;
        last = now;
        m.Engine.update(engine, delta);
        let moving = !!drag.current;
        bodies.forEach((body, i) => {
          const el = pillRefs.current[i];
          if (!el) return;
          const swallowingPill = swallowing.get(i);
          if (swallowingPill) {
            const t = Math.min(1, (now - swallowingPill.start) / 460);
            const eased = 1 - (1 - t) ** 3;
            const x = swallowingPill.x + (mouth.x - swallowingPill.x) * eased;
            const y =
              swallowingPill.y + (mouth.y + 100 - swallowingPill.y) * eased;
            el.style.transform = `translate(${x - sizes[i].w / 2}px, ${y - sizes[i].h / 2}px) rotate(${swallowingPill.angle * (1 - eased)}rad) scale(${1 - eased * 0.94})`;
            el.style.opacity = String(1 - eased);
            moving = true;
            if (t === 1) {
              el.hidden = true;
              swallowing.delete(i);
            }
            return;
          }
          if (absorbed.has(i)) return;
          if (
            i < slugs.length &&
            drag.current?.index !== i &&
            body.velocity.y > 0 &&
            previousY[i] < mouth.y &&
            body.position.y >= mouth.y &&
            Math.abs(body.position.x - mouth.x) < mouth.halfWidth
          ) {
            absorb(i);
            moving = true;
            return;
          }
          previousY[i] = body.position.y;
          el.style.transform = `translate(${body.position.x - sizes[i].w / 2}px, ${body.position.y - sizes[i].h / 2}px) rotate(${body.angle}rad)`;
          if (!body.isStatic && (body.speed > 0.05 || !body.isSleeping))
            moving = true;
          if (body.position.y < -height || body.position.y > height + 100) {
            m.Body.setPosition(body, { x: width / 2, y: 60 });
            m.Body.setVelocity(body, { x: 0, y: 0 });
          }
        });
        idle = moving ? 0 : idle + 1;
        if (idle < 12) {
          running = true;
          raf = requestAnimationFrame(tick);
        } else running = false;
      };
      const wake = () => {
        idle = 0;
        if (!running && visible && !disposed) {
          running = true;
          last = 0;
          raf = requestAnimationFrame(tick);
        }
      };
      physics.current = {
        matter: m,
        engine,
        bodies,
        width,
        height,
        wake,
        absorb,
        launch,
      };
      host.dataset.physics = "true";
      wake();
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) wake();
        else {
          cancelAnimationFrame(raf);
          running = false;
        }
      });
      observer.observe(host);
      cleanup = () => {
        observer.disconnect();
        m.Composite.clear(engine.world, false);
        m.Engine.clear(engine);
      };
    };
    void init();
    const resize = () => {
      void init();
    };
    window.addEventListener("resize", resize);
    motion.addEventListener("change", resize);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanup?.();
      physics.current = null;
      window.removeEventListener("resize", resize);
      motion.removeEventListener("change", resize);
    };
  }, [projects, reset]);

  const down = (event: PointerEvent<HTMLButtonElement>, index: number) => {
    const p = physics.current;
    if (!p) return;
    delete event.currentTarget.dataset.dragged;
    event.currentTarget.dataset.dragging = "true";
    event.currentTarget.setPointerCapture(event.pointerId);
    const b = p.bodies[index];
    p.matter.Sleeping.set(b, false);
    p.matter.Body.setStatic(b, true);
    drag.current = {
      index,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      time: event.timeStamp,
      vx: 0,
      vy: 0,
      moved: false,
    };
    p.wake();
  };
  const move = (event: PointerEvent<HTMLButtonElement>) => {
    const p = physics.current;
    const d = drag.current;
    if (!p || !d) return;
    const rect = hostRef.current!.getBoundingClientRect();
    const now = event.timeStamp;
    const dt = Math.max(10, now - d.time);
    d.vx = Math.max(-20, Math.min(20, ((event.clientX - d.lastX) / dt) * 16));
    d.vy = Math.max(-24, Math.min(24, ((event.clientY - d.lastY) / dt) * 16));
    d.moved ||=
      Math.hypot(event.clientX - d.startX, event.clientY - d.startY) > 7;
    d.lastX = event.clientX;
    d.lastY = event.clientY;
    d.time = now;
    p.matter.Body.setPosition(p.bodies[d.index], {
      x: Math.max(40, Math.min(p.width - 40, event.clientX - rect.left)),
      y: event.clientY - rect.top,
    });
  };
  const release = (
    event: PointerEvent<HTMLButtonElement>,
    cancelled = false,
  ) => {
    const d = drag.current;
    const p = physics.current;
    if (!d || !p) return;
    delete event.currentTarget.dataset.dragging;
    const body = p.bodies[d.index];
    p.matter.Body.setStatic(body, false);
    // A held body can enter Matter's sleeping state during a long drag.
    p.matter.Sleeping.set(body, false);
    p.matter.Body.setVelocity(
      body,
      cancelled || event.timeStamp - d.time > 80
        ? { x: 0, y: 0 }
        : { x: d.vx, y: d.vy },
    );
    if (d.moved) {
      event.currentTarget.dataset.dragged = "true";
      if (!cancelled && isOverIntake(event.clientX, event.clientY))
        p.absorb(d.index);
    }
    drag.current = null;
    p.wake();
  };

  return (
    <>
      <div className="build-lab" data-state={buildState}>
        <Image
          src="/playground/build-computer.png"
          alt=""
          width={1161}
          height={1355}
          sizes="(min-width: 901px) 28vw, (min-width: 701px) 40vw, 62vw"
          loading="eager"
        />
        <div className="build-screen">
          <h2>Build lab</h2>
          <p className="build-command">
            {buildState === "idle"
              ? "> ready for an idea"
              : buildState === "building"
                ? `> building ${project?.name}...`
                : `> ${project?.name} is ready`}
          </p>
          <progress aria-label="Project preview" value={progress} max={100} />
          {buildState === "ready" ? (
            <button
              className="build-open"
              onClick={() => onOpen(activeProject)}
            >
              Explore {project?.name} <ArrowUpRightIcon size={15} />
            </button>
          ) : null}
        </div>
        <div ref={intakeRef} className="build-intake" aria-hidden="true" />
      </div>
      <div className="play-instructions">
        <div className="game-controls">
          <button
            type="button"
            onClick={() => launch()}
            className="text-button build-demo"
          >
            <PlayIcon size={16} /> Try Build Lab
          </button>
          <button
            type="button"
            className="text-button"
            onClick={() => {
              if (timer.current) clearInterval(timer.current);
              setBuildState("idle");
              setProgress(0);
              setReset((v) => v + 1);
            }}
            aria-label="Reset playground"
          >
            <ArrowCounterClockwiseIcon size={16} />
          </button>
        </div>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {buildState === "ready"
          ? `${project?.name} preview ready. Use Explore ${project?.name} on the computer screen.`
          : ""}
      </p>
      <div
        className="project-playground"
        ref={hostRef}
        aria-label="Project playground"
      >
        {labels.map((label, index) => (
          <button
            key={label}
            ref={(el) => {
              pillRefs.current[index] = el;
            }}
            data-cursor="GRAB"
            className={`project-pill ${index >= slugs.length ? "category-pill" : ""}`}
            style={
              {
                "--start-x": startX(index) * 100,
                "--start-offset":
                  index < slugs.length
                    ? 260 + Math.floor(index / 6) * 64
                    : 280 + (index - slugs.length) * 30,
                "--start-angle": Math.sin(index * 23) * 0.22,
                "--pill-color":
                  index < slugs.length
                    ? "var(--surface)"
                    : `var(--${colors[index - slugs.length]})`,
              } as React.CSSProperties
            }
            onPointerDown={(e) => down(e, index)}
            onPointerMove={move}
            onPointerUp={(e) => release(e)}
            onPointerCancel={(e) => release(e, true)}
            onClick={(e) => {
              if (e.currentTarget.dataset.dragged === "true") {
                delete e.currentTarget.dataset.dragged;
                return;
              }
              if (index < slugs.length) onOpen(slugs[index]);
              else
                document.getElementById("skills")?.scrollIntoView({
                  behavior: reduced ? "instant" : "smooth",
                });
            }}
            onKeyDown={(e) => {
              if (e.key.toLowerCase() === "b" && index < slugs.length) {
                e.preventDefault();
                launch(index);
              }
            }}
            aria-label={
              index < slugs.length
                ? `Explore ${label}`
                : `Explore ${label} skills`
            }
            title={
              index < slugs.length
                ? "Click to explore. Press B to build a preview."
                : "Explore skills"
            }
          >
            {index < slugs.length && (
              <span className="pill-dot" aria-hidden="true" />
            )}
            {label}
          </button>
        ))}
      </div>
    </>
  );
}
