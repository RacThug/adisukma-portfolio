import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Satori (what `next/og` renders with) ships no monospace face, so a bare
 * `fontFamily: "monospace"` silently falls back to sans - and a terminal-themed
 * site starts sharing sans-serif cards. The TTFs are vendored under
 * assets/fonts (JetBrains Mono, OFL-1.1) so the build needs no network.
 *
 * OG images are prerendered at build time, so this only ever reads from disk
 * during `next build`.
 */
export async function jetbrainsMono() {
  const dir = join(process.cwd(), "assets", "fonts");
  const [regular, bold] = await Promise.all([
    readFile(join(dir, "JetBrainsMono-Regular.ttf")),
    readFile(join(dir, "JetBrainsMono-Bold.ttf")),
  ]);

  return [
    { name: "JetBrains Mono", data: regular, style: "normal" as const, weight: 400 as const },
    { name: "JetBrains Mono", data: bold, style: "normal" as const, weight: 700 as const },
  ];
}

/** The family name the vendored fonts register under. */
export const OG_FONT_FAMILY = "JetBrains Mono";
