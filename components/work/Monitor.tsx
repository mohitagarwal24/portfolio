import Image from "next/image";
import type { WorkMeta } from "@/lib/work";
import { CoverArt } from "./CoverArt";

/**
 * Frames any cover (screenshot or generated art) as a mission monitor, so real
 * screenshots and illustrations read as one consistent set.
 */
export function Monitor({
  work,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  className = "",
}: {
  work: Pick<WorkMeta, "slug" | "code" | "name" | "cover">;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const live = "image" in work.cover;
  return (
    <div className={`group/monitor relative overflow-hidden border border-line bg-[#070a14] ${className}`}>
      <div className="flex items-center justify-between border-b border-line bg-void/80 px-3 py-2 font-mono text-[9px] tracking-[0.22em] text-muted uppercase">
        <span>
          <span className="text-ignition">{work.code}</span> · {live ? "Live feed" : "Telemetry"}
        </span>
        <span className="flex items-center gap-1.5">
          <span className={`size-1.5 rounded-full ${live ? "bg-signal shadow-[0_0_8px_var(--color-signal)]" : "bg-ignition"}`} />
          {live ? "Rec" : "Sim"}
        </span>
      </div>
      <div className="relative aspect-[16/10]">
        {"image" in work.cover ? (
          <Image
            src={work.cover.image}
            alt={`${work.name} screenshot`}
            fill
            sizes={sizes}
            preload={priority}
            className="object-cover object-top transition-transform duration-[1.2s] ease-expo group-hover/monitor:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 transition-transform duration-[1.2s] ease-expo group-hover/monitor:scale-[1.03]">
            <CoverArt art={work.cover.art} seed={work.slug} code={work.code} />
          </div>
        )}
        {/* Scanlines + vignette keep screenshots in the site's palette. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgb(0_0_0/0.16)_0px,rgb(0_0_0/0.16)_1px,transparent_1px,transparent_3px)] opacity-40 mix-blend-multiply" />
        <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgb(5_7_13/0.85)]" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-1/2 h-1/2 bg-gradient-to-b from-transparent via-white/[0.06] to-transparent opacity-0 group-hover/monitor:animate-[sweep_1.6s_ease-in-out] group-hover/monitor:opacity-100" />
      </div>
    </div>
  );
}
