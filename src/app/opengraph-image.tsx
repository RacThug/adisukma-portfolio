import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0a0e14",
          backgroundImage:
            "linear-gradient(rgba(126,138,156,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(126,138,156,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", color: "#e8a020", fontSize: 28, marginBottom: 24 }}>
          OPEN_TO_WORK — remote · hybrid · on-site
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 700, color: "#d9e1ec" }}>
          <span style={{ color: "#e8a020" }}>$&nbsp;</span>
          {site.name}
        </div>
        <div style={{ display: "flex", fontSize: 36, color: "#7e8a9c", marginTop: 16 }}>
          {"// "}
          {site.role} — Denpasar, Bali
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#d9e1ec", marginTop: 40 }}>
          Next.js · NestJS · TypeScript
        </div>
      </div>
    ),
    size,
  );
}
