"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { ArrowUpRightIcon, XIcon } from "@phosphor-icons/react";
import { projectStories } from "@/content/portfolio";
import type { PortfolioProject } from "./types";

export function ProjectDialog({
  project,
  report,
  onClose,
}: {
  project: PortfolioProject;
  report: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.documentElement.style.overflow;
    dialog?.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.documentElement.style.overflow = overflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);
  const story = projectStories[project.slug];
  return (
    <dialog
      ref={ref}
      className="project-dialog"
      data-project={project.slug}
      aria-labelledby="project-title"
      aria-describedby="project-description"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const box = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < box.left ||
            e.clientX > box.right ||
            e.clientY < box.top ||
            e.clientY > box.bottom
          )
            onClose();
        }
      }}
    >
      <div className="dialog-top">
        <span className="eyebrow">Project notes / {project.crew}</span>
        <button
          className="icon-button"
          aria-label="Close project"
          onClick={onClose}
        >
          <XIcon size={22} />
        </button>
      </div>
      <div className="dialog-body">
        <p className="eyebrow">
          {project.when} · {project.domain.join(" / ")}
        </p>
        <h2 id="project-title">{project.name}</h2>
        <p id="project-description" className="dialog-summary">
          {project.summary}
        </p>
        <div className="tag-list">
          {project.stack.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="project-links">
          {Object.entries(project.links).map(([kind, href]) => (
            <a
              key={kind}
              className={
                kind === "repo" ? "button button-dark" : "button button-outline"
              }
              href={href}
              target="_blank"
              rel="noreferrer"
            >
              {
                {
                  repo: "GitHub",
                  live: "Live demo",
                  docs: "Documentation",
                  video: "Watch demo",
                }[kind]
              }
              <ArrowUpRightIcon size={16} />
            </a>
          ))}
        </div>
        {story?.note && <p className="project-note">{story.note}</p>}
        {story && (
          <div className="dialog-feature-image">
            <Image
              src={story.image}
              alt={`${project.name} ${project.slug === "llm-tracing" || project.slug === "nifty-intelligence" ? "illustrative preview" : "application preview"}`}
              width={1536}
              height={1024}
              sizes="(min-width: 900px) 800px, 90vw"
            />
          </div>
        )}
        <div className="project-report">{report}</div>
        {project.gallery.length > 0 && (
          <section
            className="report-gallery"
            aria-label={`${project.name} gallery`}
          >
            <h3>Closer look</h3>
            {project.gallery.map((shot) => (
              <figure key={shot.src}>
                <a
                  href={shot.src}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open full-size: ${shot.caption}`}
                >
                  <Image
                    src={shot.src}
                    alt={shot.caption}
                    width={1400}
                    height={900}
                    sizes="(min-width: 900px) 800px, 90vw"
                  />
                </a>
                <figcaption>{shot.caption}</figcaption>
              </figure>
            ))}
          </section>
        )}
        <button className="button button-outline" onClick={onClose}>
          Back to the portfolio
        </button>
      </div>
    </dialog>
  );
}
