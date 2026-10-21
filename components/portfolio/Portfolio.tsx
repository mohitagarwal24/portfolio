"use client";
import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import {
  ArrowUpIcon,
  ArrowUpRightIcon,
  DownloadSimpleIcon,
  EnvelopeSimpleIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import { siteConfig } from "@/site.config";
import { archiveImages, projectStories } from "@/content/portfolio";
import { ParticleName } from "./ParticleName";
import { ProjectPlayground } from "./ProjectPlayground";
import { SkillStack } from "./SkillStack";
import { ProjectDialog } from "./ProjectDialog";
import { AboutDialog } from "./AboutDialog";
import { QuickNavigation } from "./QuickNavigation";
import type { PortfolioProject } from "./types";
const featuredSlugs = [
  "gitcraft",
  "tradelayer",
  "llm-tracing",
  "nifty-intelligence",
  "citadel",
  "resq",
];
const categories = ["All", "Web", "AI", "Systems", "Quant", "Web3"];
const categoryLabel: Record<string, string> = {
  All: "All",
  Web: "Full-stack",
  AI: "AI & ML",
  Systems: "Systems",
  Quant: "Quant",
  Web3: "Web3",
};
const proofs = [
  {
    slug: "gitcraft",
    category: "Full-stack · AI-powered documentation",
    value: "1st",
    unit: "Craft Winter\nChallenge 2025",
    text: "GitCraft turns code changes into living engineering documentation. Built solo, from GitHub webhooks to the final interface.",
    role: "Solo developer · architecture, AI & interface",
    tag: "Hackathon winner",
  },
  {
    slug: "tradelayer",
    category: "Web3 · privacy-aware trading",
    value: "87",
    unit: "Foundry tests\n5 testnet contracts",
    text: "Institution-isolated trading workflows, encrypted orders and netted settlement. A Hedera testnet prototype with local enclave simulation.",
    role: "Full-stack · contracts & confidential workflows",
    tag: "Hedera testnet",
  },
  {
    slug: "llm-tracing",
    category: "Systems · local model instrumentation",
    value: "5",
    unit: "terminal panels\ninside inference",
    text: "A C++ tracing platform for llama.cpp. Follow callback timings, inspect attention and replay a recorded trace without loading the model.",
    role: "C++ developer · runtime instrumentation & replay",
    tag: "C++17 · llama.cpp",
  },
  {
    slug: "nifty-intelligence",
    category: "Research · quantitative machine learning",
    value: "49",
    unit: "stocks, evaluated\nout of sample",
    text: "517,956 out-of-sample predictions with purged, embargoed walk-forward validation. Research that reports costs and its limits.",
    role: "Research · modelling, validation & analysis",
    tag: "Research backtest",
  },
];
const needs = [
  "An AI tool",
  "A web app",
  "A system",
  "A website",
  "Something else",
];
const timings = ["As soon as possible", "In 1–3 months", "Just exploring"];
const resume = "/resume/mohit-agarwal.pdf";

function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (
      !matchMedia("(pointer: fine)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const el = ref.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor]",
      );
      el.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
      el.dataset.active = "true";
      el.dataset.large = target ? "true" : "false";
      el.textContent = target?.dataset.cursor ?? "";
    };
    const leave = () => {
      el.dataset.active = "false";
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);
  return <div ref={ref} className="custom-cursor" aria-hidden="true" />;
}

export function Portfolio({
  projects,
  reports,
}: {
  projects: PortfolioProject[];
  reports: Record<string, ReactNode>;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [about, setAbout] = useState(false);
  const [quick, setQuick] = useState(false);
  const [filter, setFilter] = useState("All");
  const [hi, setHi] = useState(false);
  const [need, setNeed] = useState(-1);
  const [when, setWhen] = useState(-1);
  const [draft, setDraft] = useState<string | null>(null);
  const [time, setTime] = useState("IST");
  const pageRef = useRef<HTMLDivElement>(null);
  const project = projects.find((p) => p.slug === selected);
  const archive = projects.filter((p) => !featuredSlugs.includes(p.slug));
  const availableCategories = categories.filter(
    (category) =>
      category === "All" ||
      archive.some((p) =>
        p.domain.includes(category as PortfolioProject["domain"][number]),
      ),
  );
  const filtered = archive.filter(
    (p) =>
      filter === "All" ||
      p.domain.includes(filter as PortfolioProject["domain"][number]),
  );
  useEffect(() => {
    const sync = () => {
      const hash = location.hash;
      const slug = hash.replace("#project-", "");
      setSelected(
        hash.startsWith("#project-") && projects.some((p) => p.slug === slug)
          ? slug
          : null,
      );
      setAbout(hash === "#about");
    };
    sync();
    const hashchange = (event: HashChangeEvent) => {
      history.replaceState(null, "", event.newURL);
      sync();
    };
    const keys = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (!document.querySelector("dialog[open]")) setQuick(true);
      }
    };
    const clock = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()) + " IST",
      );
    clock();
    const timer = setInterval(clock, 60000);
    window.addEventListener("hashchange", hashchange);
    window.addEventListener("popstate", sync);
    window.addEventListener("keydown", keys);
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>(".featured-project"),
    );
    let frame = 0;
    let previousY = scrollY;
    const header = pageRef.current?.querySelector<HTMLElement>(".site-header");
    const update = () => {
      frame = 0;
      if (header)
        header.dataset.dark = String(
          (document.getElementById("contact")?.getBoundingClientRect().top ??
            Infinity) < 80,
        );
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        const progress = next
          ? Math.max(
              0,
              Math.min(
                1,
                (innerHeight - next.getBoundingClientRect().top) / innerHeight,
              ),
            )
          : 0;
        card.style.setProperty("--card-scale", String(1 - progress * 0.035));
        card.style.setProperty("--card-shade", String(progress * 0.28));
      });
    };
    const scroll = () => {
      if (Math.abs(scrollY - previousY) > 6) {
        if (header)
          header.dataset.hidden = String(scrollY > previousY && scrollY > 100);
        previousY = scrollY;
      }
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", scroll, { passive: true });
    update();
    return () => {
      clearInterval(timer);
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", hashchange);
      window.removeEventListener("popstate", sync);
      window.removeEventListener("keydown", keys);
      window.removeEventListener("scroll", scroll);
    };
  }, [projects]);
  const openProject = (slug: string) => {
    setSelected(slug);
    history.pushState(null, "", `#project-${slug}`);
  };
  const closeProject = () => {
    setSelected(null);
    history.replaceState(null, "", "#work");
  };
  const openAbout = () => {
    setAbout(true);
    history.pushState(null, "", "#about");
  };
  const autoMessage = hi
    ? `नमस्ते मोहित, ${need >= 0 ? `${needs[need]} के बारे में बात करनी है।` : "मेरे मन में एक प्रोजेक्ट है। क्या हम बात कर सकते हैं?"}${when >= 0 ? ` समय: ${timings[when]}।` : ""}`
    : `Hi Mohit, ${need >= 0 ? `I'd like to talk about ${needs[need].toLowerCase()}.` : "I have a project in mind. Can we talk?"}${when >= 0 ? ` ${when === 2 ? "I'm just exploring for now." : `I'd like to get started ${timings[when].toLowerCase()}.`}` : ""}`;
  const message = draft ?? autoMessage;
  const mailHref = `mailto:${siteConfig.email}?subject=${encodeURIComponent("Let's build something")}&body=${encodeURIComponent(message)}`;
  return (
    <div
      ref={pageRef}
      lang={hi ? "hi" : "en"}
      className={hi ? "portfolio hindi" : "portfolio"}
    >
      <Cursor />
      <header className="site-header">
        <a
          href="#top"
          className="wordmark"
          aria-label="Mohit Agarwal — back to top"
        >
          MA
        </a>
        <nav aria-label="Main navigation">
          <a href="#work">{hi ? "काम" : "Work"}</a>
          <a href="#contact">{hi ? "संपर्क" : "Contact"}</a>
          <a className="resume-link" href={resume} download>
            <DownloadSimpleIcon size={19} /> CV
          </a>
          <div className="language-toggle" aria-label="Language">
            <button aria-pressed={!hi} onClick={() => setHi(false)}>
              EN
            </button>
            <button aria-pressed={hi} onClick={() => setHi(true)}>
              HI
            </button>
          </div>
        </nav>
      </header>
      <div className="intro-stage">
        <ParticleName />
        <section id="top" className="hero" aria-label="Introduction">
          <div className="hero-intro">
            <p>
              {hi
                ? "सॉफ्टवेयर इंजीनियर। Full-stack, AI और systems."
                : "I turn hard problems into working software."}
            </p>
            <span>
              {hi
                ? "Mathematics & Computing · IIT Roorkee"
                : "Full-stack · AI · Systems"}
            </span>
          </div>
          <button
            className="avatar-card"
            onClick={openAbout}
            aria-label="About Mohit Agarwal"
            data-cursor="ME"
          >
            <Image
              src="/about/developer-badge.png"
              alt="Illustrated portrait of Mohit Agarwal with his developer badge"
              width={1211}
              height={1164}
              sizes="(min-width: 900px) 28vw, 43vw"
              loading="eager"
            />
          </button>
          <ProjectPlayground projects={projects} onOpen={openProject} />
        </section>
        {proofs.map((proof, i) => {
          const item = projects.find((p) => p.slug === proof.slug)!;
          const story = projectStories[proof.slug];
          return (
            <section
              lang="en"
              className={`proof-panel proof-${i}`}
              key={proof.slug}
              aria-labelledby={`proof-${proof.slug}`}
              style={
                {
                  "--proof-color": ["#b5c5a7", "#ddb0ae", "#c5bcd4", "#e4c974"][
                    i
                  ],
                } as CSSProperties
              }
            >
              <h2 className="sr-only" id={`proof-${proof.slug}`}>
                {categoryLabel[item.domain[0]]}: {item.name}
              </h2>
              <div className="proof-copy">
                <p className="eyebrow">{proof.category}</p>
                <div className="proof-stat">
                  <strong>{proof.value}</strong>
                  <span>{proof.unit}</span>
                </div>
                <p className="proof-description">{proof.text}</p>
                <div className="proof-action">
                  <button
                    onClick={() => openProject(proof.slug)}
                    className="button"
                    data-cursor="VIEW"
                  >
                    See {item.name} →
                  </button>
                  <span className="eyebrow">{proof.role}</span>
                </div>
              </div>
              <button
                className="proof-preview"
                onClick={() => openProject(proof.slug)}
                aria-label={`View ${item.name}`}
                data-cursor="VIEW"
              >
                <span className="floating-tag">{proof.tag}</span>
                <Image
                  src={story.image}
                  alt={`${item.name} ${i > 1 ? "illustrative project overview" : "application"}`}
                  width={1536}
                  height={1024}
                  sizes="(min-width: 900px) 44vw, 86vw"
                />
              </button>
            </section>
          );
        })}
      </div>
      <SkillStack onOpen={openProject} hi={hi} />
      <section id="work" className="selected-work section-inner">
        <header className="section-heading">
          <h2 className="huge-heading">
            {hi ? (
              <>
                चुनिंदा
                <br />
                प्रोजेक्ट
              </>
            ) : (
              <>
                Selected
                <br />
                work
              </>
            )}
          </h2>
          <span className="eyebrow">6 of {projects.length}</span>
        </header>
        <div className="project-stack">
          {featuredSlugs.map((slug, i) => {
            const item = projects.find((p) => p.slug === slug)!;
            const story = projectStories[slug];
            return (
              <article
                lang="en"
                className="featured-project"
                key={slug}
                style={
                  {
                    "--project-tint": story.tint,
                    "--project-index": i,
                  } as CSSProperties
                }
                aria-labelledby={`title-${slug}`}
              >
                <div className="project-card-copy">
                  <div className="card-topline eyebrow">
                    <span>
                      {item.domain.map((x) => categoryLabel[x]).join(" / ")}
                    </span>
                    <span>{item.when}</span>
                  </div>
                  <div className="card-details">
                    <h3 id={`title-${slug}`}>
                      {slug === "nifty-intelligence" ? (
                        <>
                          NIFTY
                          <br />
                          Intelligence
                        </>
                      ) : slug === "llm-tracing" ? (
                        <>
                          LLM Tracing
                          <br />& Replay
                        </>
                      ) : (
                        item.name
                      )}
                    </h3>
                    <p className="role-pill">
                      <span>MY ROLE</span>
                      {item.crew === "Solo"
                        ? "Sole developer · every part"
                        : item.crew}
                    </p>
                    <p className="project-summary">{item.summary}</p>
                    <div className="tag-list">
                      {item.stack.slice(0, 3).map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                      <button
                        className="tag tag-dark"
                        onClick={() => openProject(slug)}
                      >
                        Explore project ↗
                      </button>
                      {item.links.live && (
                        <a
                          className="tag tag-dark"
                          href={item.links.live}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Visit site ↗
                        </a>
                      )}
                      {item.links.repo && (
                        <a
                          className="tag tag-dark"
                          href={item.links.repo}
                          target="_blank"
                          rel="noreferrer"
                        >
                          GitHub ↗
                        </a>
                      )}
                    </div>
                    <p className="card-proof eyebrow">{story.proof}</p>
                  </div>
                </div>
                <button
                  className="project-preview"
                  onClick={() => openProject(slug)}
                  aria-label={`Explore ${item.name}`}
                  data-cursor="VIEW"
                >
                  <Image
                    src={story.image}
                    alt={`${item.name} ${slug === "llm-tracing" || slug === "nifty-intelligence" ? "illustrative overview" : slug === "resq" ? "repository README" : "application"}`}
                    width={1536}
                    height={1024}
                    sizes="(min-width: 900px) 50vw, 86vw"
                  />
                  {["gitcraft", "tradelayer", "citadel"].includes(slug) && (
                    <span className="mobile-preview">
                      <Image
                        src={`/work/${slug}/mobile.webp`}
                        alt={`${item.name} on mobile`}
                        width={390}
                        height={844}
                        sizes="(min-width: 900px) 13vw, 24vw"
                      />
                    </span>
                  )}
                  <span className="preview-open">
                    <ArrowUpRightIcon size={22} />
                  </span>
                  {(slug === "llm-tracing" ||
                    slug === "nifty-intelligence" ||
                    slug === "resq") && (
                    <span className="image-caption">
                      {slug === "resq"
                        ? "Repository preview"
                        : "Illustrative overview"}
                    </span>
                  )}
                </button>
              </article>
            );
          })}
        </div>
      </section>
      <section id="all-projects" className="archive-section section-inner">
        <header className="section-heading">
          <h2 className="huge-heading">
            {hi ? (
              <>
                और
                <br />
                प्रोजेक्ट
              </>
            ) : (
              <>
                More
                <br />
                projects
              </>
            )}
          </h2>
          <span className="eyebrow" aria-live="polite">
            {filtered.length} projects
          </span>
        </header>
        <div className="filter-list" aria-label="Filter projects">
          {availableCategories.map((category) => {
            const count =
              category === "All"
                ? archive.length
                : archive.filter((p) =>
                    p.domain.includes(
                      category as PortfolioProject["domain"][number],
                    ),
                  ).length;
            return (
              <button
                key={category}
                className="filter-button"
                aria-pressed={filter === category}
                onClick={() => setFilter(category)}
              >
                <i data-category={category} />
                {categoryLabel[category]}
                <span className="sr-only">{count}</span>
              </button>
            );
          })}
        </div>
        <div className="archive-grid">
          {filtered.map((item) => (
            <article lang="en" className="archive-project" key={item.slug}>
              <button
                className="archive-image"
                onClick={() => openProject(item.slug)}
                aria-label={`Explore ${item.name}`}
                data-cursor="VIEW"
              >
                <Image
                  src={archiveImages[item.slug]}
                  alt={`${item.name} ${item.slug === "chainlance" || item.slug === "nexus" ? "architecture diagram" : "project documentation preview"}`}
                  width={1200}
                  height={750}
                  sizes="(min-width: 900px) 30vw, (min-width: 600px) 45vw, 90vw"
                />
              </button>
              <h3>
                <button onClick={() => openProject(item.slug)}>
                  {item.name}
                </button>
              </h3>
              <p>{item.summary}</p>
              <span className="archive-meta eyebrow">
                <i data-category={item.domain[0]} />
                {item.domain.map((x) => categoryLabel[x]).join(" / ")} ·{" "}
                {item.crew}
              </span>
            </article>
          ))}
        </div>
      </section>
      <section id="cv" className="resume-section section-inner">
        <div className="resume-copy">
          <h2 className="display-heading">
            {hi ? (
              <>
                मेरा CV,
                <br />
                एक पेज।
              </>
            ) : (
              <>
                My CV,
                <br />
                one page.
              </>
            )}
          </h2>
          <p>
            {hi
              ? "मेरी पढ़ाई, प्रोजेक्ट और कौशल — एक जगह।"
              : "Roles, projects and stack on a single page, ready to forward to your team."}
          </p>
          <a
            className="button resume-download"
            href={resume}
            download
            data-cursor="SAVE"
          >
            <i>
              <DownloadSimpleIcon size={30} />
            </i>
            {hi ? "CV डाउनलोड करें" : "Download CV"}
          </a>
          <span className="eyebrow">PDF · 1 page · in English · 133 KB</span>
        </div>
        <a
          className="resume-preview"
          href={resume}
          target="_blank"
          rel="noreferrer"
          aria-label="Preview Mohit Agarwal’s résumé"
          data-cursor="SAVE"
        >
          <Image
            className="resume-backing"
            src="/resume/paper-backing.png"
            alt=""
            width={1086}
            height={1448}
            sizes="45vw"
          />
          <Image
            className="resume-page"
            src="/resume/preview.png"
            alt="Mohit Agarwal’s actual one-page résumé"
            width={1061}
            height={1500}
            sizes="(min-width: 900px) 36vw, 75vw"
          />
          <span className="resume-stamp">
            DOWNLOAD
            <br />
            <DownloadSimpleIcon size={27} />
            <br />
            CV · PDF
          </span>
        </a>
      </section>
      <section
        id="contact"
        className="contact-section section-inner"
        style={
          {
            "--contact-accent": [
              "#b5c5a7",
              "#ddb0ae",
              "#c5bcd4",
              "#e4c974",
              "#c4cda7",
            ][Math.max(0, need)],
          } as CSSProperties
        }
      >
        <div className="contact-top">
          <p className="eyebrow">
            <span className="status-dot" />
            {hi ? "नए अवसरों के लिए तैयार" : "Open for new opportunities"}
          </p>
          <span className="eyebrow">Roorkee · {time}</span>
        </div>
        <ParticleName mode="contact" selection={need} />
        <div className="contact-layout">
          <div className="contact-options">
            <fieldset>
              <legend className="eyebrow">
                01. {hi ? "आपको क्या चाहिए?" : "What do you need?"}
              </legend>
              <div className="contact-reasons">
                {needs.map((n, i) => (
                  <button
                    key={n}
                    aria-pressed={need === i}
                    onClick={() => {
                      setNeed(need === i ? -1 : i);
                      setDraft(null);
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="eyebrow">02. {hi ? "कब?" : "When?"}</legend>
              <div className="contact-reasons">
                {timings.map((t, i) => (
                  <button
                    key={t}
                    aria-pressed={when === i}
                    onClick={() => {
                      setWhen(when === i ? -1 : i);
                      setDraft(null);
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
          <div className="chat-preview">
            <textarea
              aria-label="Your message to Mohit"
              value={message}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
            />
            <span>{time.replace(" IST", "")} ✓✓</span>
          </div>
        </div>
        <div className="contact-links">
          <a className="button contact-send" href={mailHref}>
            <EnvelopeSimpleIcon size={28} />
            {hi ? "ईमेल भेजें" : "Send an email"} <span>→</span>
          </a>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <a href={resume} download>
            CV (PDF)
          </a>
          {siteConfig.socials
            .filter((s) => s.label === "GitHub" || s.label === "LinkedIn")
            .map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
        </div>
        <footer className="site-footer">
          <span>© {new Date().getFullYear()} Mohit Agarwal</span>
          <div>
            <button onClick={openAbout}>About & experience</button>
            <button
              onClick={() => setQuick(true)}
              aria-keyshortcuts="Control+k Meta+k"
              aria-label="Search sections and projects"
            >
              <MagnifyingGlassIcon size={17} /> ⌘ K
            </button>
            <a href="#top">
              Back to top <ArrowUpIcon size={17} />
            </a>
          </div>
        </footer>
      </section>
      {project && (
        <ProjectDialog
          key={project.slug}
          project={project}
          report={reports[project.slug]}
          onClose={closeProject}
        />
      )}
      {about && (
        <AboutDialog
          onClose={() => {
            setAbout(false);
            history.replaceState(null, "", "#top");
          }}
        />
      )}
      {quick && (
        <QuickNavigation
          projects={projects}
          onOpen={openProject}
          onClose={() => setQuick(false)}
        />
      )}
    </div>
  );
}
