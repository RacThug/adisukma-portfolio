# Live facts are an allowlist, not a feed

The bot may state one thing that is not written in this repository: how recently each of a small,
hand-chosen set of GitHub repositories was pushed. It is fetched at request time, cached for an hour, and
appended to the system prompt after the Corpus. Everything else the bot knows still comes from
`src/content/*.ts`, unchanged. This amends ADR 0001, which said the Corpus is derived from the site and
nothing else.

**Why amend it at all.** "Is he still actively building?" is a real question a recruiter has, and the site
could only answer it with a date someone typed by hand - which is to say, with a date that starts rotting
the moment it ships. A hand-typed "last active August 2026" is worse than no answer by November. This is
the narrow case where live beats written, and it is narrow precisely because it is about *recency*, which
is the one property text cannot hold on its own.

**Decided:**

1. **The selection is curated; only the dates are live.** `src/content/github.ts` is an allowlist of
   repository names. A repo the bot can mention is a repo Adi decided to show. GitHub supplies the push
   date and nothing about *which* repos exist.
2. **The profile bio is never fetched.** It currently reads "Building production web apps, AI-first" -
   branding removed from the site in 3c77ca4, and guarded against by name in both `corpus.test.ts` and the
   evals. Pulling it would reintroduce exactly the drift ADR 0001 exists to prevent, through an automatic
   door nobody reviews.
3. **It is an argument, not a hidden fetch.** `buildSystemPrompt(liveFacts = "")` takes the appendix as a
   parameter that defaults to nothing. `buildCorpus()` stays a pure function of this repository, the unit
   suite stays hermetic, and the evals keep measuring the Spokesperson Rule against written facts. Anyone
   reading `route.ts` can see the single line where outside data enters.
4. **Every failure is silence.** GitHub down, rate-limiting us, or returning something unexpected all
   produce `""` for the prompt and `null` for the page. The prompt becomes exactly what it was yesterday
   and the section is simply not there. Same instinct as the circuit-breaker in `store.ts`: fail open, stay
   quiet, lose a feature rather than a visitor.

**Why not a feed, which is what "live GitHub data" normally means.** The account holds two dozen public
repos and most are practice: a meme picker, a blackjack game, a password generator, each described as "just
basic X with javascript" and last touched in 2024. Sorting by push date and taking the top few would put
those in front of a hiring partner, on the same page as four written-up case studies, and lower the average
of everything they see. A portfolio is a curated artefact; an activity feed is the opposite of one. The
allowlist is not a safety measure bolted onto a feed - it is the entire feature.

**Why not a tool call.** The model could be given a "look up his repos" tool and it would work. It would
also mean the bot deciding, at runtime, which facts about Adi to go and get - and ADR 0001 point 1 turns on
the bot having no such discretion. A fetch the route performs on every request, of a fixed list, is a
different object from a capability the model may invoke on a Visitor's suggestion. If a tool is ever
genuinely needed, it needs its own ADR, not this one stretched.

**Known costs.** The unauthenticated GitHub API allows 60 requests an hour per IP, shared across the
platform. One request an hour is a rounding error in that budget, but it is not zero, and a 403 is
survivable rather than impossible. The chat route now has a network dependency it did not have before,
on a cache miss, before the first token - bounded by the same 30-second `maxDuration` as everything else.

**Consequences.**

- **Adding a repo to `featuredRepos` is a content decision, not a config change.** The bar is that you
  would be happy for a hiring partner to open it cold, with no explanation from you.
- **Do not "improve" this by dropping the allowlist, sorting by stars, or pulling the bio.** Each is
  individually reasonable and collectively turns a curated portfolio back into a feed.
- The Corpus test still asserts the Corpus is exactly the site. That guarantee did not weaken; the live
  facts live outside it on purpose, and have their own tests in `chat/activity.test.ts`.
