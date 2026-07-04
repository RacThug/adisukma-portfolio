export function SectionHeading({ path, note }: { path: string; note?: string }) {
  return (
    <h2 className="font-mono text-xs tracking-[0.16em] uppercase text-muted mb-8">
      <span className="text-accent">./</span>
      {path}
      {note ? <span className="normal-case tracking-normal"> — {note}</span> : null}
    </h2>
  );
}
