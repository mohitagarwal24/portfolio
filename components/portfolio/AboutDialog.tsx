"use client";
import { useEffect, useRef } from "react";
import {
  ArrowUpRightIcon,
  DownloadSimpleIcon,
  CaretDownIcon,
  XIcon,
} from "@phosphor-icons/react";
import { siteConfig } from "@/site.config";
import { achievements, openSource } from "@/content/portfolio";
import { trajectory } from "@/content/experience";
export function AboutDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    const focus = document.activeElement as HTMLElement | null;
    const overflow = document.documentElement.style.overflow;
    d?.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => {
      d?.close();
      document.documentElement.style.overflow = overflow;
      focus?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="project-dialog about-dialog"
      aria-labelledby="about-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="dialog-top">
        <span className="eyebrow" id="about-title">
          About Mohit Agarwal
        </span>
        <button
          className="icon-button"
          aria-label="Close about"
          onClick={onClose}
        >
          <XIcon size={24} />
        </button>
      </div>
      <section id="open-source" className="opensource-section section-pad">
        <div className="section-inner">
          <header className="section-heading" data-reveal>
            <div>
              <p className="eyebrow">Building beyond my own repositories</p>
              <h2 className="display-heading">A little upstream.</h2>
              <p>Seven merged contributions. Plenty more to learn.</p>
            </div>
          </header>
          <div className="contribution-list">
            {openSource.map((source) => (
              <a
                key={source.name}
                className="contribution-row"
                href={source.href}
                target="_blank"
                rel="noreferrer"
              >
                <div>
                  <h3>
                    {source.name}
                    <ArrowUpRightIcon size={21} />
                  </h3>
                  <span>{source.context}</span>
                </div>
                <p>{source.detail}</p>
                <span className="tag">{source.count}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section
        id="about-content"
        className="section-inner about-section section-pad"
      >
        <div className="about-layout" data-reveal>
          <div>
            <p className="eyebrow">Behind the code</p>
            <h2 className="display-heading">
              Curious by default.
              <br />
              Builder by habit.
            </h2>
            <p className="about-lead">
              I&apos;m Mohit, a fourth-year Mathematics & Computing student at
              IIT Roorkee.
            </p>
            <p>
              I like owning a problem end to end: the system behind it, the
              interface someone uses, and the awkward edge cases in between. My
              projects span full-stack software, AI tools, C++ systems and
              quantitative research.
            </p>
            <p>
              I contribute to open source, enjoy competitive programming, and
              build daily with tools like Claude Code, Cursor and MCP. Outside
              code, I&apos;ve helped run podcasts, campus teams and placement
              operations. I also make films: our documentary placed third at
              Cult GC 2025, and our short film earned bronze at IIM
              Ahmedabad&apos;s Chaos.
            </p>
            <a
              className="button button-outline"
              href={siteConfig.resumeUrl}
              target="_blank"
              rel="noreferrer"
            >
              <DownloadSimpleIcon size={18} /> Read my resume{" "}
              <ArrowUpRightIcon size={16} />
            </a>
          </div>
          <aside className="education-note">
            <p className="eyebrow">A bit of context</p>
            <h3>IIT Roorkee</h3>
            <p>BS-MS · Mathematics & Computing</p>
            <span className="education-years">2023 — 2028</span>
            <div className="education-grade">
              <strong>9.31</strong>
              <span>
                CGPA
                <br />
                after six semesters
              </span>
            </div>
            <div className="incoming-note">
              <span className="status-dot" />
              <div>
                <strong>Incoming SDE Intern</strong>
                <p>Microsoft · Summer 2027</p>
              </div>
            </div>
          </aside>
        </div>
        <div className="experience-block">
          <h3 className="subsection-title">Along the way</h3>
          <div className="timeline">
            {trajectory
              .filter((x) => x.kind !== "education" && x.kind !== "honor")
              .map((entry) => (
                <details
                  className="timeline-entry"
                  key={`${entry.org}-${entry.title}`}
                >
                  <summary>
                    <span className="timeline-date">{entry.when}</span>
                    <span>
                      <strong>{entry.title}</strong>
                      <span>{entry.org}</span>
                    </span>
                    <CaretDownIcon size={19} />
                  </summary>
                  <p>{entry.detail}</p>
                </details>
              ))}
          </div>
        </div>
        <div className="achievement-block">
          <h3 className="subsection-title">A few milestones</h3>
          <div className="achievement-grid">
            {achievements.map((a) => (
              <div key={a.label}>
                <strong>{a.value}</strong>
                <h4>{a.label}</h4>
                <p>{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </dialog>
  );
}
