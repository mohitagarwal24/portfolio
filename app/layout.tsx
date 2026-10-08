import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { siteConfig } from "@/site.config";
import { work } from "@/lib/work";
import { getPosts } from "@/lib/posts";
import { Stage } from "@/components/scene/Stage";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Preloader } from "@/components/hud/Preloader";
import { TopBar } from "@/components/hud/TopBar";
import { Footer } from "@/components/hud/Footer";
import { HudLocation } from "@/components/hud/HudLocation";
import { MobileScrim } from "@/components/hud/MobileScrim";
import { CommandPalette } from "@/components/ui/CommandPalette";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} · Software Engineer`, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  openGraph: { title: siteConfig.name, description: siteConfig.description, type: "website", siteName: siteConfig.name },
  twitter: { card: "summary_large_image", creator: "@mohitagarwal_24" },
};

export const viewport: Viewport = { themeColor: "#05070d" };

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: "Software Engineer",
  alumniOf: { "@type": "CollegeOrUniversity", name: "Indian Institute of Technology Roorkee" },
  sameAs: siteConfig.socials.map((s) => s.href),
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const blogEnabled = (await getPosts()).length > 0;
  const palette = work.map((w) => ({ slug: w.slug, name: w.name, code: w.code }));
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}>
      <body className="min-h-dvh">
        <noscript>
          <style>{`[data-preloader]{display:none!important}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
        <a href="#main" className="sr-only z-[100] rounded bg-ink px-4 py-2 text-void focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
          Skip to content
        </a>
        <SmoothScroll />
        <Stage />
        <MobileScrim />
        <Preloader />
        <TopBar showLogs={blogEnabled} />
        <main id="main">{children}</main>
        <Footer />
        <HudLocation />
        <CommandPalette work={palette} showLogs={blogEnabled} />
      </body>
    </html>
  );
}
