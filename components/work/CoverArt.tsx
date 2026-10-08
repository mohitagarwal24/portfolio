// Generated cover art for projects without a UI to screenshot. Pure SVG in the site
// palette, seeded by the project slug so each cover is stable across renders.
import { mulberry32, seedFrom } from "@/lib/rand";
import type { ReactNode } from "react";
import type { ArtKind } from "@/lib/work";

const W = 800;
const H = 500;
const INK = "#e8ecf3";
const MUTED = "#8a93a6";
const FIRE = "#ff6b1a";
const GLOW = "#ffb37a";
const SIGNAL = "#5ce1e6";
const mono = "var(--font-geist-mono), monospace";

function Label({ x, y, children, color = MUTED, anchor = "start" }: { x: number; y: number; children: string; color?: string; anchor?: "start" | "end" | "middle" }) {
  return (
    <text x={x} y={y} fill={color} fontFamily={mono} fontSize="11" letterSpacing="2" textAnchor={anchor}>
      {children.toUpperCase()}
    </text>
  );
}

function Grid() {
  const lines = [];
  for (let x = 40; x < W; x += 40) lines.push(<line key={`x${x}`} x1={x} y1={0} x2={x} y2={H} />);
  for (let y = 40; y < H; y += 40) lines.push(<line key={`y${y}`} x1={0} y1={y} x2={W} y2={y} />);
  return (
    <g stroke="white" strokeOpacity="0.04">
      {lines}
    </g>
  );
}

function Attention({ r }: { r: () => number }) {
  const n = 18;
  const s = 18;
  const ox = 60;
  const oy = 70;
  const cells: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    // Causal mask: a token only attends to itself and earlier tokens.
    const row: number[] = [];
    for (let j = 0; j <= i; j++) {
      const sink = j === 0 ? 0.9 : 0;
      const diag = Math.exp(-Math.pow((i - j) / 1.6, 2));
      const block = (i >> 2) === (j >> 2) ? 0.25 : 0;
      row.push(Math.max(sink, diag * 0.85 + block + r() * 0.18));
    }
    const sum = row.reduce((a, b) => a + b, 0);
    row.forEach((v, j) => {
      const a = Math.min(1, (v / sum) * 3.2);
      cells.push(<rect key={`${i}-${j}`} x={ox + j * s} y={oy + i * s} width={s - 2} height={s - 2} fill={a > 0.55 ? GLOW : FIRE} opacity={0.08 + a * 0.92} />);
    });
  }
  const bars = Array.from({ length: 24 }, (_, i) => 20 + r() * 90 + (i % 6 === 5 ? 60 : 0));
  return (
    <>
      {cells}
      <Label x={ox} y={oy - 24}>Attention · L12 · H07</Label>
      <Label x={ox} y={oy + n * s + 30}>Causal mask · kq_soft_max</Label>
      <g transform="translate(470 120)">
        <Label x={0} y={-24}>Layer latency · ms</Label>
        {bars.map((b, i) => (
          <rect key={i} x={0} y={i * 11} width={b * 2.2} height={7} fill={i % 6 === 5 ? FIRE : INK} opacity={i % 6 === 5 ? 0.9 : 0.25} />
        ))}
        <Label x={0} y={300} color={SIGNAL}>● Anomaly ledger · replay ready</Label>
      </g>
    </>
  );
}

function walk(r: () => number, n: number, drift: number, vol: number) {
  const pts = [0];
  for (let i = 1; i < n; i++) pts.push(pts[i - 1] + drift + (r() - 0.5) * vol);
  return pts;
}

function Equity({ r, uid }: { r: () => number; uid: string }) {
  const n = 160;
  const strat = walk(r, n, 0.55, 5.2);
  const bench = walk(r, n, 0.36, 4.2);
  const min = Math.min(...strat, ...bench);
  const max = Math.max(...strat, ...bench);
  const x = (i: number) => 60 + (i / (n - 1)) * 680;
  const y = (v: number) => 400 - ((v - min) / (max - min)) * 290;
  const path = (p: number[]) => p.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  return (
    <>
      <defs>
        <linearGradient id={`eqfill-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={FIRE} stopOpacity="0.35" />
          <stop offset="1" stopColor={FIRE} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path(strat)} L740 400 L60 400 Z`} fill={`url(#eqfill-${uid})`} />
      <path d={path(bench)} fill="none" stroke={MUTED} strokeWidth="1.5" strokeDasharray="4 4" />
      <path d={path(strat)} fill="none" stroke={GLOW} strokeWidth="2.2" />
      <circle cx={x(n - 1)} cy={y(strat[n - 1])} r="5" fill={FIRE} />
      <line x1="60" y1="400" x2="740" y2="400" stroke="white" strokeOpacity="0.2" />
      <Label x={60} y={70}>Walk-forward · out of sample · net of costs</Label>
      <Label x={740} y={430} anchor="end">— strategy · - - benchmark</Label>
    </>
  );
}

function Smile({ r }: { r: () => number }) {
  const curves = [0, 1, 2, 3].map((k) => {
    const pts = [];
    for (let i = 0; i <= 60; i++) {
      const m = -1 + (i / 60) * 2; // log-moneyness
      const iv = 0.13 + 0.05 * k * 0.25 + (0.32 - k * 0.05) * m * m - 0.09 * m;
      pts.push([90 + i * 10.5, 410 - iv * 620] as const);
    }
    return pts;
  });
  return (
    <>
      {curves.map((c, k) => (
        <path key={k} d={c.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`).join(" ")} fill="none" stroke={k === 0 ? GLOW : INK} strokeOpacity={k === 0 ? 1 : 0.35 - k * 0.06} strokeWidth={k === 0 ? 2.2 : 1.3} />
      ))}
      {curves[0].filter((_, i) => i % 6 === 0).map(([px, py], i) => (
        <circle key={i} cx={px} cy={py + (r() - 0.5) * 14} r="3.5" fill="none" stroke={FIRE} />
      ))}
      <line x1="405" y1="80" x2="405" y2="420" stroke="white" strokeOpacity="0.15" strokeDasharray="3 5" />
      <Label x={90} y={70}>Implied volatility · NIFTY 50</Label>
      <Label x={405} y={445} anchor="middle">At the money</Label>
      <Label x={710} y={445} anchor="end">○ market · — Bates</Label>
    </>
  );
}

function Memory({ r }: { r: () => number }) {
  const cols = 32;
  const rows = 12;
  const s = 20;
  const blocks = [];
  let i = 0;
  while (i < cols * rows) {
    const size = 1 << Math.floor(r() * 4);
    const used = r() < 0.58;
    const frag = !used && r() < 0.3;
    for (let k = 0; k < size && i < cols * rows; k++, i++) {
      const x = 40 + (i % cols) * s;
      const y = 100 + Math.floor(i / cols) * s;
      blocks.push(<rect key={i} x={x} y={y} width={s - 3} height={s - 3} fill={used ? (k === 0 ? FIRE : GLOW) : frag ? MUTED : "white"} opacity={used ? (k === 0 ? 0.9 : 0.45) : frag ? 0.35 : 0.06} />);
    }
  }
  return (
    <>
      {blocks}
      <Label x={40} y={80}>Heap · buddy allocator · 2^k blocks</Label>
      <Label x={40} y={380} color={GLOW}>■ allocated</Label>
      <Label x={180} y={380}>■ fragmented</Label>
      <Label x={330} y={380} color={INK}>□ free</Label>
      <Label x={40} y={420}>L1 · L2 · L3 caches · LRU / LFU · paging: Clock</Label>
    </>
  );
}

function Listing({ r }: { r: () => number }) {
  const ops = ["LDA", "STA", "LDX", "COMP", "JEQ", "+JSUB", "TIXR", "LDCH", "STCH", "RSUB", "CLEAR", "LDT"];
  const syms = ["LENGTH", "BUFFER", "RETADR", "#4096", "ZERO", "RDREC", "WRREC", "EOF", "INPUT", "@RETADR", "T", "X"];
  const lines = Array.from({ length: 15 }, (_, i) => {
    const loc = (0x1000 + i * 3 + Math.floor(r() * 2)).toString(16).toUpperCase().padStart(4, "0");
    const op = ops[Math.floor(r() * ops.length)];
    const obj = Math.floor(r() * 0xffffff).toString(16).toUpperCase().padStart(6, "0");
    return { loc, op, sym: syms[Math.floor(r() * syms.length)], obj };
  });
  return (
    <>
      <Label x={60} y={70}>Pass 2 · listing · control section COPY</Label>
      {lines.map((l, i) => (
        <g key={i} fontFamily={mono} fontSize="15" fill={i === 6 ? GLOW : INK} opacity={i === 6 ? 1 : 0.55}>
          {i === 6 && <rect x={48} y={98 + i * 22} width={700} height={22} fill={FIRE} opacity="0.12" />}
          <text x={60} y={114 + i * 22}>{l.loc}</text>
          <text x={150} y={114 + i * 22}>{l.op}</text>
          <text x={260} y={114 + i * 22}>{l.sym}</text>
          <text x={560} y={114 + i * 22} opacity="0.8">{l.obj}</text>
        </g>
      ))}
    </>
  );
}

function Tiles({ r, uid }: { r: () => number; uid: string }) {
  const tiles = [];
  const greens = ["#1f3a2a", "#2b4a30", "#3a5236", "#4a4a3a", "#56503f", "#2a3340"];
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 13; x++) {
      tiles.push(<rect key={`${x}-${y}`} x={40 + x * 56} y={80 + y * 44} width={54} height={42} fill={greens[Math.floor(r() * greens.length)]} opacity={0.75} />);
      if (r() < 0.25) tiles.push(<rect key={`h${x}-${y}`} x={48 + x * 56 + r() * 20} y={88 + y * 44 + r() * 12} width={10 + r() * 14} height={8 + r() * 10} fill="#cfc6b4" opacity={0.5} />);
    }
  const heat = [0, 1, 2].map(() => ({ cx: 120 + r() * 560, cy: 140 + r() * 220, r: 50 + r() * 50 }));
  return (
    <>
      <defs>
        <radialGradient id={`cam-${uid}`}>
          <stop offset="0" stopColor={FIRE} stopOpacity="0.75" />
          <stop offset="1" stopColor={FIRE} stopOpacity="0" />
        </radialGradient>
      </defs>
      {tiles}
      {heat.map((h, i) => (
        <circle key={i} {...h} fill={`url(#cam-${uid})`} />
      ))}
      <Label x={40} y={60}>Map tiles · ResNet18 · Grad-CAM</Label>
      <Label x={760} y={460} anchor="end" color={GLOW}>R² 0.910</Label>
    </>
  );
}

function Glyphs({ r }: { r: () => number }) {
  const chars = "7KQ4ZX2M9PRT".split("");
  return (
    <>
      <Label x={60} y={80}>Input · distorted sequence</Label>
      {chars.map((c, i) => (
        <text key={i} x={70 + i * 56} y={200} fontFamily={mono} fontSize="56" fill={INK} opacity={0.75} transform={`rotate(${(r() - 0.5) * 30} ${90 + i * 56} 180) skewX(${(r() - 0.5) * 30})`}>
          {c}
        </text>
      ))}
      <Label x={60} y={280}>CTC alignment</Label>
      {Array.from({ length: 48 }, (_, i) => {
        const hit = i % 4 === 1;
        return <rect key={i} x={60 + i * 14} y={300} width={10} height={hit ? 60 : 8 + r() * 14} fill={hit ? FIRE : MUTED} opacity={hit ? 0.9 : 0.35} />;
      })}
      <Label x={60} y={410} color={GLOW}>Decoded · 7KQ4ZX2M9PRT</Label>
    </>
  );
}

function Network({ r }: { r: () => number }) {
  const nodes = Array.from({ length: 22 }, () => ({ x: 80 + r() * 640, y: 80 + r() * 340, big: r() < 0.2 }));
  const edges: [number, number][] = [];
  nodes.forEach((a, i) => {
    const near = nodes
      .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
      .filter((e) => e.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2);
    near.forEach((e) => edges.push([i, e.j]));
  });
  return (
    <>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke={i % 5 === 0 ? FIRE : INK} strokeOpacity={i % 5 === 0 ? 0.8 : 0.18} />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          {n.big && <circle cx={n.x} cy={n.y} r="16" fill="none" stroke={FIRE} strokeOpacity="0.5" />}
          <circle cx={n.x} cy={n.y} r={n.big ? 6 : 3.5} fill={n.big ? GLOW : INK} opacity={n.big ? 1 : 0.7} />
        </g>
      ))}
      <Label x={60} y={60}>Agents · contracts · stake</Label>
    </>
  );
}

function Relief({ r }: { r: () => number }) {
  const dots = [];
  for (let y = 0; y < 18; y++)
    for (let x = 0; x < 34; x++) {
      const land = Math.sin(x * 0.35 + 1.2) + Math.cos(y * 0.5) + r() * 0.6 > 0.7;
      if (land) dots.push(<circle key={`${x}-${y}`} cx={60 + x * 20.5} cy={90 + y * 19} r="2.2" fill={INK} opacity="0.25" />);
    }
  const pins = [0, 1, 2, 3].map(() => ({ x: 120 + r() * 560, y: 130 + r() * 250 }));
  return (
    <>
      {dots}
      {pins.slice(1).map((p, i) => (
        <path key={i} d={`M${pins[0].x} ${pins[0].y} Q${(pins[0].x + p.x) / 2} ${Math.min(pins[0].y, p.y) - 80} ${p.x} ${p.y}`} fill="none" stroke={FIRE} strokeOpacity="0.6" strokeDasharray="4 5" />
      ))}
      {pins.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="14" fill={FIRE} opacity="0.15" />
          <circle cx={p.x} cy={p.y} r="5" fill={i === 0 ? GLOW : FIRE} />
        </g>
      ))}
      <Label x={60} y={60}>Proof of relief · pinned to IPFS</Label>
    </>
  );
}

function Enclave({ r, uid }: { r: () => number; uid: string }) {
  const inst = [0, 1, 2, 3].map((i) => ({ x: 110, y: 120 + i * 85 }));
  const hex = (cx: number, cy: number, s: number) =>
    Array.from({ length: 6 }, (_, k) => {
      const a = (Math.PI / 3) * k + Math.PI / 6;
      return `${(cx + s * Math.cos(a)).toFixed(1)},${(cy + s * Math.sin(a)).toFixed(1)}`;
    }).join(" ");
  const bars = [0, 1, 2, 3, 4].map(() => 40 + r() * 110);
  return (
    <>
      <defs>
        <radialGradient id={`tee-${uid}`}>
          <stop offset="0" stopColor={FIRE} stopOpacity="0.45" />
          <stop offset="1" stopColor={FIRE} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="400" cy="250" r="150" fill={`url(#tee-${uid})`} />
      {inst.map((p, i) => (
        <g key={i}>
          <path d={`M${p.x + 40} ${p.y} C 250 ${p.y}, 290 250, 340 250`} fill="none" stroke={INK} strokeOpacity="0.25" />
          <rect x={p.x - 34} y={p.y - 16} width={68} height={32} fill="none" stroke={INK} strokeOpacity="0.4" />
          <text x={p.x} y={p.y + 4} fill={MUTED} fontFamily={mono} fontSize="11" textAnchor="middle">
            INST-{i + 1}
          </text>
          {/* sealed order in flight */}
          <rect x={200 + i * 14} y={p.y + (250 - p.y) * 0.45 - 6} width={16} height={12} fill="none" stroke={GLOW} />
          <path d={`M${200 + i * 14} ${p.y + (250 - p.y) * 0.45 - 6} l8 6 l8 -6`} fill="none" stroke={GLOW} />
        </g>
      ))}
      <polygon points={hex(400, 250, 64)} fill="#0b1020" stroke={FIRE} strokeWidth="2" />
      <polygon points={hex(400, 250, 80)} fill="none" stroke={FIRE} strokeOpacity="0.35" />
      <text x="400" y="246" fill={INK} fontFamily={mono} fontSize="14" textAnchor="middle" letterSpacing="3">
        TEE
      </text>
      <text x="400" y="266" fill={MUTED} fontFamily={mono} fontSize="10" textAnchor="middle" letterSpacing="2">
        ATTESTED
      </text>
      <path d="M470 250 L560 250" stroke={FIRE} strokeWidth="1.5" />
      <g transform="translate(580 160)">
        {bars.map((b, i) => (
          <rect key={i} x={i * 30} y={180 - b} width={20} height={b} fill={GLOW} opacity={0.25 + i * 0.12} />
        ))}
      </g>
      <Label x={60} y={60}>Sealed orders → enclave → netted settlement</Label>
      <Label x={580} y={370}>Batch · every 5 min</Label>
    </>
  );
}

function Patch({ code }: { code: string }) {
  return (
    <g transform="translate(400 250)">
      <circle r="150" fill="none" stroke="white" strokeOpacity="0.12" />
      <circle r="118" fill={FIRE} fillOpacity="0.05" stroke={FIRE} strokeOpacity="0.5" />
      <ellipse rx="190" ry="56" fill="none" stroke="white" strokeOpacity="0.2" transform="rotate(-24)" />
      <circle cx="160" cy="-80" r="8" fill={FIRE} />
      <text y="14" fill={INK} fontFamily={mono} fontSize="44" textAnchor="middle" letterSpacing="6">
        {code}
      </text>
    </g>
  );
}

export function CoverArt({ art, seed, code }: { art: ArtKind; seed: string; code: string }) {
  const r = mulberry32(seedFrom(seed));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="size-full" role="img" aria-label={`${art} illustration`}>
      <rect width={W} height={H} fill="#070a14" />
      <Grid />
      {art === "attention" && <Attention r={r} />}
      {art === "equity" && <Equity r={r} uid={seed} />}
      {art === "smile" && <Smile r={r} />}
      {art === "memory" && <Memory r={r} />}
      {art === "listing" && <Listing r={r} />}
      {art === "tiles" && <Tiles r={r} uid={seed} />}
      {art === "glyphs" && <Glyphs r={r} />}
      {art === "network" && <Network r={r} />}
      {art === "relief" && <Relief r={r} />}
      {art === "enclave" && <Enclave r={r} uid={seed} />}
      {art === "patch" && <Patch code={code} />}
    </svg>
  );
}
