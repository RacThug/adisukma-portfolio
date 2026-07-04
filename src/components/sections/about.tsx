import { site } from "@/content/site";
import { SectionHeading } from "@/components/section-heading";

const facts: [string, string][] = [
  ["status", "open to work"],
  ["roles", "frontend · backend · fullstack"],
  ["location", "Denpasar, Bali (UTC+8)"],
  ["stack", "Next.js · NestJS · TypeScript"],
  ["workflow", "AI-first · spec-first"],
];

export function About() {
  return (
    <section id="about" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20">
      <SectionHeading path="about" note="who I am" />
      <div className="grid gap-10 md:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5 leading-relaxed text-ink/90">
          {site.longBio.map((para) => (
            <p key={para.slice(0, 32)}>{para}</p>
          ))}
        </div>
        <aside className="h-fit rounded-md border border-line bg-surface/70 p-6">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            currently
          </p>
          <dl className="space-y-3 font-mono text-xs">
            {facts.map(([key, value]) => (
              <div key={key} className="flex flex-col gap-0.5">
                <dt className="text-muted">{key}:</dt>
                <dd className="text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}
