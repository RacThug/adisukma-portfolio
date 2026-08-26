import { fetchRepoActivity, timeAgo } from "@/lib/github";

/**
 * The one part of what the bot knows that is not written down.
 *
 * Everything in the Corpus is a projection of `src/content` - text Adi typed,
 * reviewed, and shipped. This is not: it is the last push date of the repos he
 * allowlisted, read from GitHub while the Visitor waits. So it is deliberately
 * kept apart from `buildCorpus()` rather than folded into it, for three reasons
 * that all point the same way.
 *
 * The Corpus stays a pure function of the repo, so `corpus.test.ts` can keep
 * asserting that it is exactly the site and nothing more, without a network call
 * in the unit suite. The evals keep measuring the Spokesperson Rule against
 * written facts, which is what they exist to measure. And the seam stays visible:
 * anyone reading `route.ts` can see that one line of the prompt comes from
 * somewhere Adi does not control, which is the sort of thing that should be
 * obvious rather than buried.
 *
 * The *selection* is still curated - `src/content/github.ts` decides which repos
 * exist at all. Only the dates are live. A live fact about a chosen repo is a
 * different thing from a live feed of whatever was pushed last, and only the
 * first one is safe to put in front of a recruiter.
 *
 * Returns `""` when GitHub is unreachable, rate-limited, or simply has nothing
 * to say. An empty string appends nothing, the prompt is exactly what it was
 * before, and the bot carries on knowing slightly less. Nobody notices, which is
 * the correct amount of noticing.
 */
export async function buildActivityFacts(now: Date = new Date()): Promise<string> {
  const repos = await fetchRepoActivity();
  if (repos.length === 0) return "";

  const lines = repos.map((repo) => {
    const described = repo.description ? `: ${repo.description}` : "";
    const language = repo.language ? ` Written mainly in ${repo.language}.` : "";
    return `- ${repo.name}${described} Last pushed ${timeAgo(repo.pushedAt, now)}, at ${repo.url}.${language}`;
  });

  return [
    "",
    "",
    "## Public code, as of right now",
    "",
    // Facts about the list, not instructions about it. Behaviour lives in
    // `prompt.ts`, and the rule there - everything you say comes from the FACTS
    // section - already governs this the same as every other section.
    "These are the repositories he publishes openly, and how recently each was worked on. It is a selection he chose to show, not a complete list of everything he has written.",
    "",
    ...lines,
  ].join("\n");
}
