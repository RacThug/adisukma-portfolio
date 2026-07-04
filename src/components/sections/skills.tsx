import { SectionHeading } from "@/components/section-heading";
import { skillGroups, topSkills, waysOfWorking } from "@/content/skills";

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20">
      <SectionHeading path="skills" note="core stack" />

      <div className="mb-10 flex flex-wrap gap-3">
        {topSkills.map((skill) => (
          <span
            key={skill}
            className="rounded-sm border border-accent px-4 py-2 font-mono text-sm text-accent"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group) => (
          <div key={group.label} className="rounded-md border border-line bg-surface/70 p-5">
            <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              {group.label}
            </h3>
            <ul className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-xs bg-chip px-2.5 py-1 font-mono text-[11px] text-ink"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-8 font-mono text-xs leading-relaxed text-muted">
        <span className="text-accent"># ways of working:</span>{" "}
        {waysOfWorking.join(" · ")}
      </p>
    </section>
  );
}
