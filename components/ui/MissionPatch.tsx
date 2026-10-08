export function MissionPatch({ code, className = "size-14" }: { code: string; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={`shrink-0 ${className}`} aria-hidden>
      <circle cx="32" cy="32" r="30" fill="none" stroke="rgb(255 255 255 / 0.18)" />
      <circle cx="32" cy="32" r="24" fill="rgb(255 107 26 / 0.06)" stroke="rgb(255 107 26 / 0.5)" />
      <ellipse cx="32" cy="32" rx="29" ry="9" fill="none" stroke="rgb(255 255 255 / 0.25)" transform="rotate(-28 32 32)" />
      <circle cx="57" cy="20" r="2.2" fill="var(--color-ignition)" />
      <text x="32" y="35.5" textAnchor="middle" fontSize="10" fontFamily="var(--font-geist-mono)" fill="#e8ecf3" letterSpacing="1">
        {code}
      </text>
    </svg>
  );
}

export const STATUS_STYLE = {
  Flagship: "border-ignition/60 text-ignition-glow",
  Winner: "border-amber-300/50 text-amber-200",
  Shipped: "border-signal/40 text-signal",
  Research: "border-violet-300/40 text-violet-200",
} as const;
