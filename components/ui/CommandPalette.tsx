"use client";

import { Command } from "cmdk";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/site.config";
import { lockScroll } from "@/components/SmoothScroll";

export const OPEN_PALETTE = "palette:open";

type Item = { slug: string; name: string; code: string };

const itemCls =
  "flex cursor-pointer items-center justify-between gap-4 rounded-md px-3 py-2.5 text-[15px] text-ink/80 data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-ink";
const groupCls =
  "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-4 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:tracking-[0.25em] [&_[cmdk-group-heading]]:text-muted [&_[cmdk-group-heading]]:uppercase";

export function CommandPalette({ work, showLogs }: { work: Item[]; showLogs: boolean }) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    lockScroll(true, "command-palette");
    return () => lockScroll(false, "command-palette");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE, onOpen);
    };
  }, []);

  const run = (fn: () => void) => {
    setOpen(false);
    fn();
  };
  const go = (href: string) => run(() => router.push(href));
  const external = (href: string) => run(() => window.open(href, "_blank", "noopener"));
  const copyEmail = () =>
    run(async () => {
      try {
        await navigator.clipboard.writeText(siteConfig.email);
        setToast("Email copied");
      } catch {
        window.location.href = `mailto:${siteConfig.email}`;
      }
      window.setTimeout(() => setToast(""), 2000);
    });

  return (
    <>
      <Command.Dialog
        data-lenis-prevent
        open={open}
        onOpenChange={setOpen}
        label="Jump to"
        overlayClassName="fixed inset-0 z-[90] bg-void/70 backdrop-blur-sm"
        contentClassName="fixed top-[14vh] left-1/2 z-[91] w-[min(620px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden border border-line bg-hull/95 shadow-[0_40px_120px_-20px_rgb(0_0_0/0.8)] backdrop-blur-xl"
      >
        <DialogTitle className="sr-only">Jump to a page or project</DialogTitle>
        <DialogDescription className="sr-only">Search pages, projects and contact actions. Use the arrow keys to choose and Enter to open.</DialogDescription>
        <div className="flex items-center gap-3 border-b border-line px-4">
          <span className="font-mono text-[11px] text-ignition">›</span>
          <Command.Input placeholder="Where to?" className="h-14 w-full bg-transparent text-lg text-ink outline-none placeholder:text-muted" />
          <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">ESC</kbd>
        </div>
        <Command.List data-lenis-prevent className="max-h-[56vh] overflow-y-auto overscroll-contain p-2">
          <Command.Empty className="px-3 py-8 text-center text-muted">Nothing out here.</Command.Empty>
          <Command.Group heading="Pages" className={groupCls}>
            <Command.Item className={itemCls} onSelect={() => go("/")}>Home</Command.Item>
            <Command.Item className={itemCls} onSelect={() => go("/work")}>All work</Command.Item>
            <Command.Item className={itemCls} onSelect={() => go("/about")}>About</Command.Item>
            {showLogs && <Command.Item className={itemCls} onSelect={() => go("/logs")}>Logs</Command.Item>}
          </Command.Group>
          <Command.Group heading="Projects" className={groupCls}>
            {work.map((w) => (
              <Command.Item key={w.slug} value={`${w.name} ${w.code}`} className={itemCls} onSelect={() => go(`/work/${w.slug}`)}>
                {w.name}
                <span className="font-mono text-[10px] tracking-[0.15em] text-muted">{w.code}</span>
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading="Contact" className={groupCls}>
            <Command.Item className={itemCls} onSelect={copyEmail}>
              Copy email <span className="font-mono text-[11px] text-muted">{siteConfig.email}</span>
            </Command.Item>
            {siteConfig.resumeUrl && (
              <Command.Item className={itemCls} onSelect={() => external(siteConfig.resumeUrl)}>Resume</Command.Item>
            )}
            {siteConfig.socials.map((s) => (
              <Command.Item key={s.label} className={itemCls} onSelect={() => external(s.href)}>
                {s.label} <span className="font-mono text-[11px] text-muted">↗</span>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command.Dialog>
      {toast && (
        <div role="status" className="fixed bottom-16 left-1/2 z-[95] -translate-x-1/2 rounded-full border border-line bg-hull px-4 py-2 font-mono text-[11px] tracking-[0.15em] text-ink uppercase">
          ✓ {toast}
        </div>
      )}
    </>
  );
}
