"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { siteConfig } from "@/site.config";
import { journey } from "@/lib/journey";
import { LAUNCH_EVENT } from "@/components/hud/Preloader";
import { scrollToId } from "@/components/SmoothScroll";
import { ButtonGhost, ButtonPrimary } from "@/components/ui/primitives";

function useClock(timeZone: string) {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [timeZone]);
  return time;
}

function SplitWord({ text }: { text: string }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
      {[...text].map((c, i) => (
        <span key={i} data-char className="inline-block will-change-transform">
          {c}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const time = useClock(siteConfig.location.timeZone);
  const { lat, lon } = siteConfig.location;
  const [first, ...rest] = siteConfig.name.split(" ");

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const q = gsap.utils.selector(root);
      if (reduced) {
        journey.intro = 1;
        return;
      }
      gsap.set(q("[data-char]"), { yPercent: 115 });
      gsap.set(q("[data-fade]"), { opacity: 0, y: 18 });
      gsap.set(q("[data-line]"), { scaleX: 0 });

      const play = () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.to(journey, { intro: 1, duration: 4.2, ease: "power2.out" }, 0)
          .to(q("[data-char]"), { yPercent: 0, duration: 1.4, stagger: 0.035 }, 0.35)
          .to(q("[data-line]"), { scaleX: 1, duration: 1.6, ease: "expo.inOut" }, 0.5)
          .to(q("[data-fade]"), { opacity: 1, y: 0, duration: 1.2, stagger: 0.09 }, 0.8);
      };
      if (journey.ready) play();
      else window.addEventListener(LAUNCH_EVENT, play, { once: true });
      return () => window.removeEventListener(LAUNCH_EVENT, play);
    },
    { scope: root },
  );

  // Hero copy drifts up and fades as the ascent begins.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.to("[data-hero-copy]", {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom 35%", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section id="launch" ref={root} aria-label="Introduction" className="relative h-dvh min-h-[640px] w-full">
      <div data-hero-copy className="mx-auto flex h-full max-w-[1400px] flex-col px-5 pt-[16vh] md:px-10 md:pt-[17vh] lg:pr-36">
        <div data-fade className="flex w-fit items-center gap-3 rounded-full border border-line bg-void/40 py-1.5 pr-4 pl-2 backdrop-blur-sm">
          <span className="relative flex size-2.5 items-center justify-center">
            <span className="absolute size-full animate-ping rounded-full bg-signal/60" />
            <span className="size-1.5 rounded-full bg-signal" />
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-ink uppercase md:text-[11px]">
            {profile.status}
          </span>
        </div>

        <h1 className="mt-7 text-[clamp(3.2rem,10.5vw,9.5rem)] leading-[0.92] font-medium tracking-[-0.055em]">
          <span className="sr-only">{siteConfig.name}</span>
          <SplitWord text={first} />{" "}
          <span className="inline-block">
            <SplitWord text={rest.join(" ")} />
          </span>
        </h1>

        <div data-line className="mt-6 h-px w-full max-w-xl origin-left bg-gradient-to-r from-ignition via-ignition/40 to-transparent" />

        <p data-fade className="mt-6 max-w-xl text-2xl leading-snug tracking-[-0.02em] text-ink md:text-[1.85rem]">
          {profile.tagline[0]} <em className="font-serif text-[1.08em] font-normal text-ignition-glow italic">{profile.tagline[1]}</em>
        </p>

        <div data-fade className="mt-9 flex flex-wrap gap-3">
          <ButtonPrimary onClick={() => scrollToId("featured")}>See my work</ButtonPrimary>
          <ButtonGhost href="/about">About me</ButtonGhost>
          {siteConfig.resumeUrl && <ButtonGhost href={siteConfig.resumeUrl}>Resume</ButtonGhost>}
        </div>
      </div>

      <div
        data-fade
        className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1400px] items-end justify-between px-5 pb-6 font-mono text-[10px] tracking-[0.2em] text-muted uppercase md:px-10 md:pb-8 lg:pr-36"
      >
        <div className="hidden gap-6 sm:flex">
          <span>
            <span className="text-ignition">◉</span> {siteConfig.location.label}
          </span>
          <span>
            {lat.toFixed(2)}°N {lon.toFixed(2)}°E
          </span>
          <span className="tabular-nums text-ink">
            {time} {siteConfig.location.tzLabel}
          </span>
        </div>
        <button onClick={() => scrollToId("intro")} className="group ml-auto flex items-center gap-3 text-ink/80 transition-colors hover:text-ink">
          Scroll to ascend
          <span className="relative block h-8 w-px overflow-hidden bg-line">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[drop_2.2s_ease-in-out_infinite] bg-ignition" />
          </span>
        </button>
      </div>
    </section>
  );
}
