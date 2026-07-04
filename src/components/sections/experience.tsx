import { SectionHeading } from "@/components/section-heading";
import { education, experience } from "@/content/experience";

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20">
      <SectionHeading path="experience" note="timeline" />
      <ol className="relative space-y-10 border-l border-line pl-8">
        {experience.map((entry) => (
          <li key={`${entry.company}-${entry.period}`} className="relative">
            <span
              aria-hidden
              className={`absolute -left-[37px] top-1.5 size-2.5 rounded-full ${
                entry.current ? "bg-accent" : "bg-line"
              }`}
            />
            <p className="font-mono text-xs text-muted">{entry.period}</p>
            <h3 className="mt-1 text-lg font-semibold text-ink">
              {entry.title} <span className="text-muted">— {entry.company}</span>
            </h3>
            <p className="mt-0.5 font-mono text-[11px] text-muted">{entry.meta}</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/85">
              {entry.description}
            </p>
            {entry.stack ? (
              <p className="mt-2 font-mono text-[11px] text-muted">
                <span className="text-accent">stack:</span> {entry.stack}
              </p>
            ) : null}
          </li>
        ))}
      </ol>

      <div className="mt-14 rounded-md border border-line bg-surface/70 p-6">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          education
        </p>
        <p className="font-semibold text-ink">{education.school}</p>
        <p className="text-sm text-muted">{education.degree}</p>
      </div>
    </section>
  );
}
