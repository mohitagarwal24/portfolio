import { ImageResponse } from "next/og";
import { siteConfig } from "@/site.config";

export const socialSize = { width: 1200, height: 630 };

export function socialImage({ title, description, label, image }: { title: string; description: string; label: string; image?: string }) {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#05070d", color: "#e8ecf3", padding: 56, fontFamily: "sans-serif", position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", width: image ? 660 : 880, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#ffb37a", fontSize: 22, letterSpacing: 4 }}>
          <svg width="48" height="48" viewBox="0 0 32 32"><circle cx="16" cy="16" r="6" fill="none" stroke="#ffb37a" strokeWidth="1.5" /><ellipse cx="16" cy="16" rx="14" ry="5.5" fill="none" stroke="#ffb37a" transform="rotate(-24 16 16)" /></svg>
          {label.toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: title.length > 30 ? 60 : 78, letterSpacing: -3, lineHeight: 1.06 }}>{title}</div>
          <div style={{ fontSize: 25, lineHeight: 1.4, color: "#aeb8cb", maxWidth: 790 }}>{description}</div>
        </div>
        <div style={{ display: "flex", borderTop: "1px solid #343b4b", paddingTop: 22, fontSize: 20, color: "#ffb37a" }}>{siteConfig.name} · Software Engineer</div>
      </div>
      {image ? (
        // ImageResponse embeds the local image bytes; next/image is for browser HTML.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" width={360} height={420} style={{ objectFit: "cover", objectPosition: "top", marginLeft: 48, marginTop: 65, border: "1px solid #343b4b", borderRadius: 10 }} />
      ) : (
        <svg width="420" height="630" viewBox="0 0 420 630" style={{ position: "absolute", right: -130, top: 0 }}>
          <circle cx="260" cy="315" r="185" fill="#0b1020" stroke="#ff6b1a" strokeWidth="2" />
          <circle cx="260" cy="315" r="235" fill="none" stroke="#343b4b" />
          <ellipse cx="260" cy="315" rx="295" ry="75" fill="none" stroke="#ffb37a" transform="rotate(-35 260 315)" />
          <circle cx="94" cy="414" r="8" fill="#ff6b1a" />
        </svg>
      )}
    </div>, socialSize,
  );
}
