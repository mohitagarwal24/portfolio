"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRightIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react";
import type { PortfolioProject } from "./types";

export function QuickNavigation({
  projects,
  onOpen,
  onClose,
}: {
  projects: PortfolioProject[];
  onOpen: (slug: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const items = [
    ...[
      { name: "Selected work", id: "work" },
      { name: "Skills", id: "skills" },
      { name: "About & experience", id: "about" },
      { name: "Contact", id: "contact" },
    ].map((x) => ({ ...x, project: false })),
    ...projects.map((p) => ({ name: p.name, id: p.slug, project: true })),
  ].filter((x) => x.name.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => {
    const dialog = dialogRef.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.documentElement.style.overflow;
    dialog?.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.documentElement.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    dialogRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);
  const choose = (item: (typeof items)[number]) => {
    onClose();
    if (item.project) onOpen(item.id);
    else {
      location.hash = item.id;
    }
  };
  return (
    <dialog
      ref={dialogRef}
      className="quick-dialog"
      aria-labelledby="quick-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const rect = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
          )
            onClose();
        }
      }}
    >
      <h2 id="quick-title" className="sr-only">
        Jump to a section or project
      </h2>
      <div className="quick-search">
        <MagnifyingGlassIcon size={22} />
        <input
          aria-label="Search sections and projects"
          placeholder="Where would you like to go?"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((v) => (v + 1) % Math.max(1, items.length));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive(
                (v) => (v + items.length - 1) % Math.max(1, items.length),
              );
            }
            if (e.key === "Enter" && items[active]) {
              e.preventDefault();
              choose(items[active]);
            }
          }}
        />
        <button
          className="icon-button"
          aria-label="Close navigation"
          onClick={onClose}
        >
          <XIcon size={20} />
        </button>
      </div>
      <div className="quick-results">
        {items.length ? (
          items.map((item, i) => (
            <button
              key={item.id}
              data-active={active === i}
              onPointerMove={() => setActive(i)}
              onClick={() => choose(item)}
            >
              {item.name}
              <span>
                {item.project ? "Project" : "Section"}
                <ArrowUpRightIcon size={15} />
              </span>
            </button>
          ))
        ) : (
          <p className="empty-state">
            No matches. Try another project or section.
          </p>
        )}
      </div>
      <p className="quick-help">
        Arrow keys to browse · Enter to open · Esc to close
      </p>
    </dialog>
  );
}
