import { featuredRepos, githubOwner } from "@/content/github";

/** What we are willing to take from GitHub, and nothing else. */
export interface RepoActivity {
  name: string;
  description: string | null;
  language: string | null;
  url: string;
  /** ISO 8601, straight from the API. Formatting is the caller's problem. */
  pushedAt: string;
}

/**
 * An hour. Nobody is refreshing a portfolio to watch a commit land, and the
 * unauthenticated API allows 60 requests an hour per IP - which we share with
 * every other function on the platform. One request an hour is a rounding error
 * in that budget; one per page view is a 403 waiting for a recruiter.
 */
const REVALIDATE_SECONDS = 60 * 60;

interface GithubRepo {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  pushed_at: string;
  fork: boolean;
}

function isRepo(value: unknown): value is GithubRepo {
  if (typeof value !== "object" || value === null) return false;
  const repo = value as Partial<GithubRepo>;
  return (
    typeof repo.name === "string" &&
    typeof repo.html_url === "string" &&
    typeof repo.pushed_at === "string"
  );
}

/**
 * The last push date for each allowlisted repo, newest first.
 *
 * **One request, not one per repo.** The list endpoint costs a single call
 * against the rate limit no matter how long the allowlist grows, and we filter
 * locally. Asking for each repo by name would make the budget scale with the
 * allowlist, which is exactly backwards.
 *
 * **Never throws, never rejects.** GitHub being down, rate-limiting us, or
 * returning something we did not expect all produce an empty array, and an empty
 * array renders nothing. This runs on a page a recruiter came to read and inside
 * the chat route that must always answer; neither may fail because a third party
 * did. Same instinct as the circuit-breaker in `chat/store.ts`: fail open, stay
 * quiet, lose a feature rather than a visitor.
 */
export async function fetchRepoActivity(): Promise<RepoActivity[]> {
  const allowed = new Set<string>(featuredRepos);
  if (allowed.size === 0) return [];

  try {
    const response = await fetch(
      `https://api.github.com/users/${githubOwner}/repos?per_page=100&sort=pushed`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        next: { revalidate: REVALIDATE_SECONDS },
      },
    );

    if (!response.ok) return [];

    const body: unknown = await response.json();
    if (!Array.isArray(body)) return [];

    return body
      .filter(isRepo)
      .filter((repo) => !repo.fork && allowed.has(repo.name))
      .map((repo) => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        url: repo.html_url,
        pushedAt: repo.pushed_at,
      }))
      .sort((a, b) => b.pushedAt.localeCompare(a.pushedAt));
  } catch {
    return [];
  }
}

/**
 * A repository URL reduced to something two sources can be compared on.
 *
 * `projects.ts` stores a URL a human typed; GitHub returns its own. They point
 * at the same repo and differ in case, a trailing slash, or a `.git` suffix -
 * enough for `===` to miss, and a miss here means a repo listed twice on one
 * page under a heading that says "also".
 */
export function repoKey(url: string): string {
  return url.trim().toLowerCase().replace(/\.git$/, "").replace(/\/+$/, "");
}

/**
 * The repos that are not already written up as projects.
 *
 * What makes the word "also" in "also public on github" true. A repo linked
 * from a case study appears there with a paragraph of context; repeating it in
 * a one-line list below adds nothing and quietly halves how much work the page
 * appears to represent.
 *
 * A pure function rather than a filter inside the component, because "a
 * written-up repo never appears twice on the page" is the kind of claim that
 * should have a test rather than a careful reader.
 */
export function excludeWrittenUp(
  activity: RepoActivity[],
  repoUrls: readonly (string | undefined)[],
): RepoActivity[] {
  const writtenUp = new Set(repoUrls.flatMap((url) => (url ? [repoKey(url)] : [])));
  return activity.filter((repo) => !writtenUp.has(repoKey(repo.url)));
}

/**
 * "3 days ago", in the coarsest unit that is still true.
 *
 * Deliberately imprecise. "Last pushed 14 minutes ago" reads as someone
 * performing activity for an audience; "last week" reads as a person with a job.
 * The point of the date is to show the code is alive, not to timestamp it.
 */
export function timeAgo(iso: string, now: Date = new Date()): string {
  const then = new Date(iso);
  const days = Math.floor((now.getTime() - then.getTime()) / 86_400_000);

  if (Number.isNaN(days) || days < 0) return "recently";
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "last week";
  if (days < 60) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return "over a year ago";
}
