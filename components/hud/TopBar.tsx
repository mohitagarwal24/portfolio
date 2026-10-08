"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/site.config";
import { scrollToId } from "@/components/SmoothScroll";
import { OPEN_PALETTE } from "@/components/ui/CommandPalette";

const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
];

export function MissionMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="16" cy="16" rx="14" ry="5.5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.55" transform="rotate(-24 16 16)" />
      <circle cx="28.2" cy="10.6" r="2" fill="var(--color-ignition)" />
    </svg>
  );
}

export function TopBar({ showLogs }: { showLogs: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links = showLogs ? [...LINKS, { href: "/logs", label: "Logs" }] : LINKS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  // Close the mobile menu after navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const contact = () => {
    setOpen(false);
    scrollToId("contact");
  };
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || open ? "border-b border-line bg-void/60 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-10">
        <Link href="/" className="group flex items-center gap-3 text-ink" aria-label={`${siteConfig.name}, home`}>
          <MissionMark className="size-7 transition-transform duration-700 group-hover:rotate-[24deg]" />
          <span className="font-mono text-[11px] tracking-[0.28em] uppercase">{siteConfig.name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`relative rounded-full px-4 py-2 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors ${
                isActive(l.href) ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {isActive(l.href) && <span className="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-ignition" />}
              {l.label}
            </Link>
          ))}
          <button onClick={contact} className="rounded-full px-4 py-2 font-mono text-[11px] tracking-[0.2em] text-muted uppercase transition-colors hover:text-ink">
            Contact
          </button>
          <button
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE))}
            className="ml-3 flex items-center gap-2 rounded-full border border-white/15 py-1.5 pr-2 pl-4 font-mono text-[11px] tracking-[0.2em] text-muted uppercase transition-colors hover:border-white/35 hover:text-ink"
            aria-label="Jump to ⌘K: open command palette"
          >
            Jump to
            <kbd className="rounded-full border border-line bg-hull px-2 py-0.5 text-[10px] tracking-normal text-ink">⌘K</kbd>
          </button>
        </nav>

        <button className="flex size-10 items-center justify-center md:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menu">
          <span className="relative block h-3 w-6">
            <span className={`absolute left-0 h-px w-6 bg-ink transition-transform ${open ? "top-1.5 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 h-px w-6 bg-ink transition-transform ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
          </span>
        </button>
      </div>

      {open && (
        <nav aria-label="Mobile" className="border-t border-line px-5 pt-2 pb-8 md:hidden">
          {[{ href: "/", label: "Home" }, ...links].map((l, i) => (
            <Link key={l.href} href={l.href} className="flex w-full items-baseline gap-4 border-b border-line py-4 text-2xl text-ink">
              <span aria-hidden className="font-mono text-[10px] text-ignition">0{i + 1}</span>
              {l.label}
            </Link>
          ))}
          <button onClick={contact} className="flex w-full items-baseline gap-4 border-b border-line py-4 text-left text-2xl text-ink">
            <span aria-hidden className="font-mono text-[10px] text-ignition">0{links.length + 2}</span>
            Contact
          </button>
        </nav>
      )}
    </header>
  );
}
