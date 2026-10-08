export type BlogSource = { kind: "none" } | { kind: "rss"; feedUrl: string };

export const siteConfig = {
  name: "Mohit Agarwal",
  shortName: "MA",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, ""), // set once a domain is chosen
  description:
    "Mohit Agarwal is a software engineer and Mathematics & Computing student at IIT Roorkee who builds full-stack, AI and systems projects.",
  email: "mohit_a@ma.iitr.ac.in",
  resumeUrl: "https://drive.google.com/file/d/1JKiM79CsFqRe6zgicuSMjeEHyR-PY-qC/view?usp=sharing",
  location: { label: "Roorkee, IN", lat: 29.8649, lon: 77.8966, timeZone: "Asia/Kolkata", tzLabel: "IST" },
  // Shared by the home crew viewport and About badge.
  portrait: "/about/portrait-orbital.jpg" as string | null,
  socials: [
    { label: "GitHub", handle: "mohitagarwal24", href: "https://github.com/mohitagarwal24" },
    { label: "LinkedIn", handle: "mohit-agarwal24", href: "https://www.linkedin.com/in/mohit-agarwal24/" },
    { label: "X", handle: "@mohitagarwal_24", href: "https://x.com/mohitagarwal_24" },
    { label: "Codeforces", handle: "mohitagarwal_24", href: "https://codeforces.com/profile/mohitagarwal_24" },
  ],
  // Switch to { kind: "rss", feedUrl: "https://medium.com/feed/@you" } (Medium / Substack) when posts exist.
  blog: { kind: "none" } as BlogSource,
} as const;
