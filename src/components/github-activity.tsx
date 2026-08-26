import { projects } from "@/content/projects";
import { excludeWrittenUp, timeAgo, type RepoActivity } from "@/lib/github";

/**
 * The allowlisted repos that are *not* already written up above.
 *
 * The heading says "also", so it has to be true. A repo linked from a case
 * study, as `dewasa-ayu` is, appears there with a paragraph of context and its
 * own push date; repeating it here in one line adds nothing and quietly halves
 * the apparent size of the work. Filtering by the project's own `repoUrl` means
 * writing a repo up automatically removes it from this list, which is the right
 * direction for that dependency to run.
 *
 * Deliberately quiet, and placed under the case studies rather than beside them.
 * The written-up projects are the argument; this is a footnote that says there
 * is more code and it is alive. If it ever competes visually with the cards
 * above it, it has stopped doing its job.
 *
 * Renders nothing at all when there is nothing left to show - no empty state, no
 * "unavailable", no skeleton that never resolves. A section that silently is not
 * there costs a visitor nothing. A broken one costs the impression this whole
 * page exists to make.
 */
export function GithubActivity({ activity }: { activity: RepoActivity[] }) {
  const repos = excludeWrittenUp(
    activity,
    projects.map((project) => project.repoUrl),
  );
  if (repos.length === 0) return null;

  return (
    <div className="mt-10 border-t border-line pt-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        <span className="text-accent"># </span>
        also public on github
      </p>
      <ul className="mt-4 space-y-3">
        {repos.map((repo) => (
          <li key={repo.name}>
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-xs text-muted transition-colors hover:text-accent"
            >
              <span className="font-semibold text-ink transition-colors group-hover:text-accent">
                {repo.name}
              </span>
              {repo.language ? <span>{repo.language}</span> : null}
              <span>pushed {timeAgo(repo.pushedAt)}</span>
              <span aria-hidden>↗</span>
            </a>
            {repo.description ? (
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted">
                {repo.description}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
