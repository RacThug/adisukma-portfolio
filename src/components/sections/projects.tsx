import Link from "next/link";
import { Chip } from "@/components/chip";
import { SectionHeading } from "@/components/section-heading";
import { projects } from "@/content/projects";

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20">
      <SectionHeading path="projects" note="selected work" />
      <div className="space-y-6">
        {projects.map((project) => (
          <article
            key={project.slug}
            className="group relative rounded-md border border-line bg-surface/70 p-7 transition-colors hover:border-muted md:p-9"
          >
            <span className="absolute right-7 top-7 font-mono text-xs text-muted">
              {project.index}
            </span>
            <p className="font-mono text-[11px] tracking-[0.08em] text-accent">{project.type}</p>
            <h3 className="mt-2 font-mono text-xl font-bold text-ink md:text-2xl">
              <Link href={`/projects/${project.slug}`} className="hover:text-accent transition-colors">
                {project.title}
              </Link>
            </h3>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">{project.summary}</p>
            <ul className="mt-5 space-y-1.5 text-sm text-ink/85">
              {project.highlights.slice(0, 3).map((highlight) => (
                <li key={highlight} className="flex gap-2.5">
                  <span aria-hidden className="font-mono text-accent">
                    »
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {project.featuredTech.map((tech) => (
                <Chip key={tech}>{tech}</Chip>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs font-semibold">
              <Link
                href={`/projects/${project.slug}`}
                className="text-accent hover:underline underline-offset-4"
              >
                cat case-study.md →
              </Link>
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted transition-colors hover:text-accent"
                >
                  live ↗
                </a>
              ) : null}
              {project.repoUrl ? (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted transition-colors hover:text-accent"
                >
                  source ↗
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
