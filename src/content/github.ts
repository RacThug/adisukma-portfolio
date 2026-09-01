import { z } from "zod";
import data from "./github.json";

export const githubFileSchema = z.strictObject({
  githubOwner: z.string().min(1),
  featuredRepos: z.array(z.string().min(1)).readonly(),
});

const parsed = githubFileSchema.parse(data);

export const githubOwner = parsed.githubOwner;

/**
 * The repositories this site is willing to show. An allowlist, never a feed.
 *
 * The account holds two dozen public repos and most of them are practice: a
 * meme picker, a blackjack game, a password generator, all "just basic X with
 * javascript". Sorting by push date and taking the top few would put those in
 * front of a recruiter, next to four written-up case studies, and lower the
 * average of everything they see. A portfolio is a curated thing; an activity
 * feed is the opposite of one.
 *
 * So a name only appears here because Adi decided it should. Adding one to
 * `github.json` is the whole procedure for growing this section - and the bar
 * for adding one is that you would be happy to have a hiring partner open it
 * cold.
 *
 * What is live is the *activity*, not the selection: the last push date comes
 * from GitHub at request time, so the section ages by itself and cannot go
 * stale the way a hand-typed date would.
 */
export const featuredRepos: readonly string[] = parsed.featuredRepos;
