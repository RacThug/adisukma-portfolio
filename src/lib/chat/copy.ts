import { site } from "@/content/site";

/**
 * Everything the chat says in its own voice, and everything the widget says
 * around it.
 *
 * This module deliberately imports nothing but `site`. The client bundle needs
 * the Handoff text, and if it reached for it through `prompt.ts` it would drag
 * the entire Corpus and system prompt into the browser with it - shipping the
 * bot's instructions to anyone who opens devtools, and paying for it in
 * kilobytes on every page load. Keeping the copy here makes that impossible
 * rather than merely unlikely.
 */

/**
 * What the bot says when the Corpus does not cover the question.
 *
 * A Handoff is a successful outcome, not a failure (see CONTEXT.md). It is also
 * what a Visitor sees when we are rate-limited, out of quota, or the provider is
 * down - from where they are sitting, nothing went wrong: they asked a question
 * and got a person's email address. See docs/adr/0003.
 */
export const HANDOFF = `The site doesn't cover that. You can ask Adi directly at ${site.email}.`;

export const OUT_OF_BUDGET = `I'm taking a break right now. Adi's the best person to ask anyway - he's at ${site.email}.`;

export const TOO_LONG = `That's a long one. Could you trim it to a sentence or two? Or if it's easier, Adi's at ${site.email}.`;

export const TOO_MANY_MESSAGES = `We've covered a fair bit in this thread. For anything more, Adi's the one to ask: ${site.email}.`;

/** Shown if the network itself fails, so the panel never dead-ends on a spinner. */
export const UNREACHABLE = `Something went wrong on my end. Adi's at ${site.email} if it's urgent.`;

/**
 * The opening chips.
 *
 * They do two jobs. They solve the blank-box problem - nobody knows what to ask
 * an empty text field - and they steer Visitors toward the Corpus, so fewer
 * conversations dead-end in a Handoff. Each one is a question the site can
 * actually answer well.
 */
export const SUGGESTIONS = [
  "Who is he?",
  "What has he built?",
  "What's his stack?",
  "Is he available?",
] as const;

/** The launcher, the panel title, and the input placeholder are one phrase. */
export const ASK_LABEL = "ask about adi";

export const EMPTY_STATE = `Ask me anything about Adi. I answer from what's on this site, and I'll point you at his email for anything else.`;

/** The nudge. Its copy is the site's own pitch, aimed at the one person who needs it. */
export const NUDGE = "Short on time? Ask instead of skimming.";

/**
 * The AI disclosure, shown in the first frame rather than discovered three
 * messages in. A Visitor who works it out for themselves feels tricked; one who
 * is told immediately feels handed a tool. See docs/adr/0004.
 */
export const DISCLOSURE = "AI · answers only from this site";

/**
 * How long a logged question survives. `store.ts` derives the TTL from this and
 * the footer states it to Visitors, so the promise and the behaviour cannot
 * drift apart - which they would the moment they were written down twice.
 */
export const QUESTION_TTL_DAYS = 30;

/** The disclosure the Question Log earns. See docs/adr/0004. */
export const PRIVACY_NOTE = `the assistant is AI, and answers only from this site. questions asked of it are kept for ${QUESTION_TTL_DAYS} days - questions only, with no answers, no conversation history, and nothing identifying - so Adi can see what people want to know.`;
