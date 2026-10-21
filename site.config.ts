export type BlogSource = { kind: "none" } | { kind: "rss"; feedUrl: string };

export const siteConfig = {
  name: "Mohit Agarwal",
  shortName: "MA",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.maddiee.dev").replace(/\/+$/, ""),
  description:
    "Mohit Agarwal is a software engineer and Mathematics & Computing student at IIT Roorkee who builds full-stack, AI and systems projects.",
  email: "contact@maddiee.dev",
  resumeUrl: "https://drive.google.com/file/d/1nOnEObP4gzj2UGUpvBMd-ug7fbTQXuu9/view",
  location: { label: "Roorkee, IN", lat: 29.8649, lon: 77.8966, timeZone: "Asia/Kolkata", tzLabel: "IST" },
  portrait: "/about/avatar.png" as string | null,
  socials: [
    { label: "GitHub", handle: "mohitagarwal24", href: "https://github.com/mohitagarwal24" },
    { label: "LinkedIn", handle: "mohit-agarwal24", href: "https://www.linkedin.com/in/mohit-agarwal24/" },
    { label: "X", handle: "@mohitagarwal_24", href: "https://x.com/mohitagarwal_24" },
    { label: "Codeforces", handle: "mohitagarwal_24", href: "https://codeforces.com/profile/mohitagarwal_24" },
  ],
  // Switch to { kind: "rss", feedUrl: "https://medium.com/feed/@you" } (Medium / Substack) when posts exist.
  blog: { kind: "none" } as BlogSource,
} as const;
