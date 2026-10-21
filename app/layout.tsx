import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Archivo, JetBrains_Mono } from "next/font/google";
import { siteConfig } from "@/site.config";
import "./globals.css";

const sans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});
const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
});
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} · Software Engineer`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
    siteName: siteConfig.name,
  },
  twitter: { card: "summary_large_image", creator: "@mohitagarwal_24" },
};
export const viewport: Viewport = { themeColor: "#f0e8da" };
const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: "Software Engineer",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "Indian Institute of Technology Roorkee",
  },
  sameAs: siteConfig.socials.map((s) => s.href),
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
    >
      {/* Grammar extensions add attributes here before React hydrates. */}
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
