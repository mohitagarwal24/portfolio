import { ImageResponse } from "next/og";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#f0e8da",
        color: "#bd4326",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 31,
        fontWeight: 800,
        letterSpacing: -3,
      }}
    >
      MA
    </div>,
    size,
  );
}
