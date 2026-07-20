import Image from "next/image";
import { site } from "@/content/site";
import { SectionHeading } from "@/components/section-heading";
import profilePhoto from "@/assets/profile-photo.png";

const facts: [string, string][] = [
  ["status", "open to work"],
  ["roles", "frontend · backend · fullstack"],
  ["location", "Denpasar, Bali (UTC+8)"],
  ["stack", "Next.js · NestJS · TypeScript"],
  ["workflow", "spec-first · tested end to end"],
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
        <aside className="space-y-4">
          <div className="overflow-hidden rounded-md border border-line bg-surface/70">
            <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
              <span aria-hidden className="flex gap-1.5">
                <i className="size-2 rounded-full bg-line" />
                <i className="size-2 rounded-full bg-line" />
                <i className="size-2 rounded-full bg-accent/70" />
              </span>
              <span className="font-mono text-[11px] text-muted">avatar.sh</span>
            </div>
            <div className="relative aspect-square">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(115%_80%_at_50%_12%,color-mix(in_srgb,var(--accent)_9%,transparent),transparent_58%)]"
              />
              <Image
                src={profilePhoto}
                alt={`${site.name}, ${site.role}`}
                sizes="(max-width: 768px) 100vw, 360px"
                className="relative aspect-square w-full object-cover"
              />
            </div>
            <p className="border-t border-line px-4 py-2.5 font-mono text-[11px] text-muted">
              photo.png · {site.name.toLowerCase().replace(/\s+/g, "_")}
            </p>
          </div>

          <div className="h-fit rounded-md border border-line bg-surface/70 p-6">
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
          </div>
        </aside>
      </div>
    </section>
  );
}
