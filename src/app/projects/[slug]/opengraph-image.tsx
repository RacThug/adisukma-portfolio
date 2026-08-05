import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import { site } from "@/content/site";
import { jetbrainsMono, OG_FONT_FAMILY } from "@/lib/og-fonts";

// `alt` has to be a module constant, so it describes the card rather than the
// project. Deriving it per slug means `generateImageMetadata`, which drops the
// route to `[__metadata_id__]` and stops the PNGs being prerendered - a bad
// trade for scrapers that hit these cold.
export const alt = `Project case study card from ${site.name}'s portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The image route needs its own copy: `generateStaticParams` on the page does
// not carry over to a metadata route in the same segment.
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

const INK = "#d9e1ec";
const MUTED = "#7e8a9c";
const ACCENT = "#e8a020";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  // Monospace at 1040px of usable width fits ~27 characters a line at 64px, so
  // long titles step down rather than spilling onto a third line.
  const titleSize = project.title.length > 36 ? 56 : 64;

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
          fontFamily: OG_FONT_FAMILY,
        }}
      >
        <div style={{ display: "flex", color: ACCENT, fontSize: 26, marginBottom: 24 }}>
          {project.type}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: titleSize,
            fontWeight: 700,
            color: INK,
            lineHeight: 1.15,
          }}
        >
          {project.title}
        </div>
        <div style={{ display: "flex", fontSize: 30, color: MUTED, marginTop: 20 }}>
          {"// "}
          {project.role}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 40 }}>
          {project.featuredTech.map((tech) => (
            <div
              key={tech}
              style={{
                display: "flex",
                fontSize: 24,
                color: INK,
                padding: "8px 18px",
                borderRadius: 6,
                border: "1px solid rgba(126,138,156,0.35)",
                backgroundColor: "rgba(126,138,156,0.08)",
              }}
            >
              {tech}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 26, color: MUTED, marginTop: 56 }}>
          <span style={{ color: ACCENT }}>$&nbsp;</span>
          {site.url.replace(/^https?:\/\//, "")}/projects/{project.slug}
        </div>
      </div>
    ),
    { ...size, fonts: await jetbrainsMono() },
  );
}
