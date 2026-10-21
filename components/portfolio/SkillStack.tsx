"use client";
import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import {
  ArrowUpRightIcon,
  UsersThreeIcon,
  CodeIcon,
  CpuIcon,
  BrainIcon,
  DatabaseIcon,
  CheckIcon,
} from "@phosphor-icons/react";
import { skillLayers } from "@/content/portfolio";
const icons = [
  UsersThreeIcon,
  CodeIcon,
  BrainIcon,
  CpuIcon,
  DatabaseIcon,
  CheckIcon,
];
export function SkillStack({
  onOpen,
  hi = false,
}: {
  onOpen: (slug: string) => void;
  hi?: boolean;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const layer = skillLayers[active];
  return (
    <section id="skills" className="skills-section section-inner">
      <div className="skills-layout">
        <div
          className="layer-stack"
          role="tablist"
          aria-label="Engineering skills"
          aria-orientation="vertical"
        >
          {skillLayers.map((item, i) => (
            <button
              key={item.name}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-controls="skill-panel"
              id={`skill-tab-${i}`}
              tabIndex={active === i ? 0 : -1}
              data-cursor="GRAB"
              className={`skill-layer ${active === i ? "is-selected" : ""}`}
              style={
                {
                  "--layer-index": i,
                  "--layer-tint": item.color,
                  "--layer-lift": i < active ? -45 : 0,
                  zIndex: 6 - i,
                } as CSSProperties
              }
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                let next = active;
                if (e.key === "ArrowDown" || e.key === "ArrowRight")
                  next = (active + 1) % 6;
                else if (e.key === "ArrowUp" || e.key === "ArrowLeft")
                  next = (active + 5) % 6;
                else if (e.key === "Home") next = 0;
                else if (e.key === "End") next = 5;
                else return;
                e.preventDefault();
                setActive(next);
                refs.current[next]?.focus();
              }}
            >
              <Image
                src={`/playground/layer-${i}-color.webp`}
                alt=""
                loading="eager"
                width={1701}
                height={924}
                sizes="(min-width: 900px) 36vw, 85vw"
              />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
        <div className="skill-copy">
          <h2 className="display-heading">
            {hi ? (
              <>
                मैं क्या
                <br />
                करता हूँ
              </>
            ) : (
              <>
                What
                <br />I do
              </>
            )}
          </h2>
          <p className="tap-hint">{hi ? "एक परत चुनें।" : "Tap a layer."}</p>
          <div
            id="skill-panel"
            role="tabpanel"
            aria-labelledby={`skill-tab-${active}`}
            tabIndex={0}
            className="skill-panel"
            style={{ "--active-color": layer.color } as CSSProperties}
          >
            <p className="eyebrow">Layer {active + 1} of 6</p>
            <h3>{layer.name}</h3>
            <p className="skill-description">{layer.description}</p>
            <div className="skill-tools">
              {layer.tools.map((tool, i) => {
                const Icon = icons[i];
                return (
                  <span key={tool}>
                    <i>
                      <Icon size={22} />
                    </i>
                    {tool}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="skill-selectors" aria-label="Choose a skill">
            {skillLayers.map((item, i) => (
              <button
                key={item.name}
                aria-pressed={active === i}
                onClick={() => setActive(i)}
                style={
                  active === i
                    ? {
                        background: item.color,
                        color: "#0b0f1b",
                        borderColor: item.color,
                      }
                    : undefined
                }
              >
                {item.name}
              </button>
            ))}
          </div>
          <button
            className="text-button skill-project-link"
            onClick={() => onOpen(layer.projects[0])}
          >
            Explore a related project <ArrowUpRightIcon size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
