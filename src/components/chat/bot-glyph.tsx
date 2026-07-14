/**
 * TERMINAL BOT.
 *
 * The only pictogram on this site, and drawn rather than installed.
 *
 * The site's icon language is typographic - `$` in the hero, `//` before the
 * role, `~` at the prompt, `▸` on the chips. There are no pictograms anywhere
 * else, and that is what makes "Systems Mono" read as a terminal instead of a
 * dashboard. So the one exception is built from the same parts: a square head on
 * hairline strokes, and a `>_` shell caret for a mouth. Not a rounded mascot,
 * and deliberately not Lucide's `Bot`, which is the most-used icon in every AI
 * wrapper on the internet and would undercut the one thing this site is selling.
 */
export function BotGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      {/* antenna */}
      <path d="M12 2.6v2.4" />
      <circle cx="12" cy="1.9" r="1" fill="currentColor" stroke="none" />
      {/* head */}
      <rect x="3.5" y="5" width="17" height="14" />
      {/* a shell caret, for a mouth */}
      <path d="M7.5 10.5l2 2-2 2" />
      <path d="M12.5 14.5h4" />
    </svg>
  );
}
