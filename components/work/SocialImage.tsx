import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { siteConfig } from "@/site.config";
export const socialSize = { width: 1200, height: 630 };
const avatar = await sharp(
  await readFile(join(process.cwd(), "public/about/developer-badge.png")),
)
  .resize({ width: 500 })
  .png()
  .toBuffer();
export function socialImage({
  title,
  description,
  label,
  image,
}: {
  title: string;
  description: string;
  label: string;
  image?: string;
}) {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#f0e8da",
        color: "#292623",
        padding: 56,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 660,
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontSize: 19,
            color: "#625b54",
          }}
        >
          <span style={{ fontSize: 32, fontWeight: 800, color: "#292623" }}>
            MA
          </span>
          {label}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: title.length > 30 ? 56 : 78,
              letterSpacing: -3,
              lineHeight: 1.04,
              fontWeight: 700,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 24,
              lineHeight: 1.4,
              color: "#625b54",
              maxWidth: 630,
            }}
          >
            {description}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            borderTop: "1px solid #29262340",
            paddingTop: 22,
            fontSize: 17,
          }}
        >
          maddiee.dev · {siteConfig.name}
        </div>
      </div>
      {/* next/og embeds image bytes, rather than a browser image element. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image ?? `data:image/png;base64,${avatar.toString("base64")}`}
        alt=""
        width={360}
        height={420}
        style={{
          objectFit: image ? "cover" : "contain",
          objectPosition: image ? "top" : "bottom",
          marginLeft: 48,
          marginTop: 65,
          background: "transparent",
          borderRadius: 18,
        }}
      />
    </div>,
    socialSize,
  );
}
