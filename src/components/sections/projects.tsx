import Link from "next/link";
import { Chip } from "@/components/chip";
import { GithubActivity } from "@/components/github-activity";
import { SectionHeading } from "@/components/section-heading";
import { projects } from "@/content/projects";
import { fetchRepoActivity, repoKey, timeAgo } from "@/lib/github";

export async function Projects() {
  // One fetch, shared. The push date belongs next to the repo it describes, so
  // a written-up project carries its own recency and the strip below carries
  // only what is not written up. See docs/adr/0005.
  const activity = await fetchRepoActivity();
  const pushedAt = new Map(activity.map((repo) => [repoKey(repo.url), repo.pushedAt]));

  return (
    <section id="projects" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20">
      <SectionHeading path="projects" note="selected work" />
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.slug}
            className="group flex min-w-0 flex-col rounded-md border border-line bg-surface/70 p-6 transition-colors hover:border-muted md:p-7"
          >
            <p className="font-mono text-[11px] tracking-[0.08em] text-accent">
              <span className="mr-2 text-muted">{project.index}</span>{project.type}
            </p>
            <h3 className="mt-3 font-mono text-xl font-bold text-ink">
              <Link href={`/projects/${project.slug}`} className="hover:text-accent transition-colors">
                {project.title}
              </Link>
            </h3>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">{project.summary}</p>
            <p className="mt-4 text-sm text-ink/85">{project.role}</p>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {project.featuredTech.map((tech) => (
                <Chip key={tech}>{tech}</Chip>
              ))}
            </div>
            <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 font-mono text-xs font-semibold">
              <Link
                href={`/projects/${project.slug}`}
                className="text-accent hover:underline underline-offset-4"
              >
                Read case study →
              </Link>
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-accent"
                >
                  live ↗
                </a>
              ) : null}
              {project.repoUrl ? (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-accent"
                >
                  source ↗
                </a>
              ) : null}
              {project.repoUrl && pushedAt.has(repoKey(project.repoUrl)) ? (
                <span className="font-normal text-muted">
                  pushed {timeAgo(pushedAt.get(repoKey(project.repoUrl))!)}
                </span>
              ) : null}
            </div>
          </article>
        ))}
      </div>
      <GithubActivity activity={activity} />
    </section>
  );
}
