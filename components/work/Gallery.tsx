"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { WorkMeta } from "@/lib/work";

type Shot = WorkMeta["gallery"][number];

export function Gallery({ shots, name }: { shots: Shot[]; name: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % shots.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + shots.length) % shots.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, shots.length]);

  const current = open === null ? null : shots[open];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {shots.map((s, i) => (
          <figure key={s.src} data-reveal className={shots.length % 2 === 1 && i === 0 ? "sm:col-span-2" : ""}>
            <button
              onClick={() => setOpen(i)}
              className="group brackets relative block w-full overflow-hidden border border-line bg-hull/60 p-2 text-left"
              aria-label={`Open image: ${s.caption}`}
            >
              <div className={`relative aspect-[16/10] overflow-hidden ${s.kind === "diagram" ? "bg-white" : "bg-[#070a14]"}`}>
                <Image
                  src={s.src}
                  alt={s.caption}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className={`transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.03] ${s.kind === "diagram" ? "object-contain p-3" : "object-cover object-top"}`}
                />
              </div>
            </button>
            <figcaption className="mt-3 flex gap-3 font-mono text-[10px] leading-relaxed tracking-[0.15em] text-muted uppercase">
              <span className="text-ignition">{String(i + 1).padStart(2, "0")}</span>
              {s.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        className="m-auto max-h-[92vh] w-[min(1400px,94vw)] bg-transparent p-0 backdrop:bg-void/90 backdrop:backdrop-blur-sm"
        aria-label={`${name} gallery`}
      >
        {current && (
          <div className="flex flex-col gap-3">
            <div className={`relative h-[80vh] w-full ${current.kind === "diagram" ? "bg-white" : "bg-[#070a14]"}`}>
              <Image src={current.src} alt={current.caption} fill sizes="94vw" className="object-contain" />
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.15em] text-ink uppercase">
              <span>{current.caption}</span>
              <button onClick={() => setOpen(null)} className="rounded-full border border-white/20 px-4 py-2 hover:border-white/50" autoFocus>
                Close · Esc
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
