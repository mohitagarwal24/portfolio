// Shared, mutable journey state. The DOM writes it (scroll, route, pointer, intro),
// the WebGL scene reads it every frame. Kept outside React to avoid re-renders.

/** Camera stops, in flight order. Indices match KEYFRAMES in components/scene/layout.ts. */
export const STOPS = [
  { label: "Low Earth orbit", short: "LEO", altitudeKm: 408 },
  { label: "Geostationary orbit", short: "GEO", altitudeKm: 35_786 },
  { label: "Lunar orbit", short: "LUNAR", altitudeKm: 384_400 },
  { label: "Mars orbit", short: "MARS", altitudeKm: 225_000_000 },
  { label: "Main belt", short: "BELT", altitudeKm: 400_000_000 },
  { label: "Interstellar", short: "DEEP", altitudeKm: 25_300_000_000 },
] as const;

/** Where each page parks the camera. Navigating between pages flies between these. */
export const PAGE_STOP = { about: 2, work: 3, project: 4, logs: 4, lost: 5 } as const;

/** Home page sections, each tied to a camera stop. The Moon and belt pass by in transit. */
export const HOME_WAYPOINTS = [
  { id: "launch", label: "Launch", stop: 0 },
  { id: "intro", label: "Intro", stop: 1 },
  { id: "featured", label: "Work", stop: 3 },
  { id: "contact", label: "Contact", stop: 5 },
] as const;

type Segment = { holdStart: number; holdEnd: number };

export const journey = {
  sceneReady: false,
  /** "scroll": home page, camera follows scroll. "fixed": camera parks at `index`. */
  mode: "fixed" as "scroll" | "fixed",
  /** Continuous camera stop, e.g. 2.5 = halfway between the Moon and Mars. */
  index: 0,
  /** Continuous home-section index (for the altitude rail). */
  section: 0,
  segments: [] as Segment[],
  pointer: { x: 0, y: 0 },
  /** 0 → 1 as the hero intro (sunrise) plays. */
  intro: 0,
  ready: false,
  reducedMotion: false,
};

export const SCENE_PROGRESS = "ascent:scene-progress";
export function reportSceneProgress(progress: number, active: boolean, total: number) {
  journey.sceneReady = total > 0 && !active && progress >= 100;
  window.dispatchEvent(new CustomEvent(SCENE_PROGRESS, { detail: { progress, active, total } }));
}

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  (window as unknown as { __journey: typeof journey }).__journey = journey;
}

const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/** Measure each home section; the camera holds while a section is on screen and travels between them. */
export function measureSegments() {
  const vh = window.innerHeight;
  journey.segments = HOME_WAYPOINTS.map(({ id }, i) => {
    const el = document.getElementById(id);
    if (!el) return { holdStart: 0, holdEnd: 0 };
    const top = el.getBoundingClientRect().top + window.scrollY;
    const bottom = top + el.offsetHeight;
    const holdStart = i === 0 ? 0 : top - vh * 0.25;
    const holdEnd = Math.max(holdStart, bottom - vh * 0.85);
    return { holdStart, holdEnd };
  });
}

function sectionForScroll(y: number) {
  const s = journey.segments;
  if (!s.length) return 0;
  for (let i = 0; i < s.length; i++) {
    if (y <= s[i].holdEnd) {
      if (i === 0 || y >= s[i].holdStart) return i;
      const prev = s[i - 1].holdEnd;
      const t = (y - prev) / Math.max(1, s[i].holdStart - prev);
      return i - 1 + smootherstep(Math.min(1, Math.max(0, t)));
    }
  }
  return s.length - 1;
}

/** Called on scroll while the home page is active. */
export function updateFromScroll(y: number) {
  if (journey.mode !== "scroll") return;
  const f = sectionForScroll(y);
  const i = Math.min(HOME_WAYPOINTS.length - 2, Math.floor(f));
  const t = f - i;
  journey.section = f;
  journey.index = HOME_WAYPOINTS[i].stop + (HOME_WAYPOINTS[i + 1].stop - HOME_WAYPOINTS[i].stop) * t;
}

/** Log-interpolated distance from Earth for a continuous stop index. */
export function altitudeAt(index: number) {
  const last = STOPS.length - 1;
  const i = Math.min(last, Math.max(0, Math.floor(index)));
  const j = Math.min(last, i + 1);
  const t = index - i;
  const a = Math.log(STOPS[i].altitudeKm);
  const b = Math.log(STOPS[j].altitudeKm);
  return Math.exp(a + (b - a) * t);
}

export function formatKm(km: number) {
  if (km >= 1e9) return `${(km / 1e9).toFixed(2)}B km`;
  if (km >= 1e6) return `${(km / 1e6).toFixed(1)}M km`;
  return `${Math.round(km).toLocaleString("en-US")} km`;
}
