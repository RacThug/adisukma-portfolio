import { site, workPreferences } from "./site";

export interface HiringAnswer {
  /** The question in a hiring partner's own words, not ours. */
  question: string;
  /** Adi's own answer. One or two sentences, same voice as the rest of the site. */
  answer: string;
}

/**
 * The questions the rest of the site cannot structurally answer.
 *
 * Every other content module describes work that has already happened. These
 * describe intent and logistics, which no project write-up implies and the bot
 * is explicitly forbidden from inferring: "open to remote, hybrid, or on-site"
 * does not tell anyone when he can start or whether he would move.
 *
 * So the bot used to Handoff on the five things recruiters ask first. Each entry
 * here is one of those Handoffs, retired - and retired the only way ADR 0001
 * allows, by Adi writing the answer down on his own site rather than by letting
 * a model guess it.
 *
 * Two rules for editing this file. Write answers Adi would be happy to see
 * quoted back at him in a first call, because they will be. And never restate a
 * fact another module already owns: if a date lives in `experience.ts`, refer to
 * it, do not copy it. A copied fact is a fact that rots.
 */
export const hiringFaq: HiringAnswer[] = [
  {
    question: "When can he start?",
    answer:
      "Immediately. His most recent role has ended and there is no notice period to serve, so the start date is whatever the role needs it to be.",
  },
  {
    question: "Where is he based, and would he relocate?",
    answer:
      `${site.location} (${workPreferences.timezone}). ${workPreferences.remote}; ${workPreferences.local.toLowerCase()}. ${workPreferences.relocation}`,
  },
  {
    question: "How well does his day overlap with other timezones?",
    answer:
      "UTC+8 is the same working clock as Singapore, Kuala Lumpur, and Perth, an hour ahead of Jakarta, and an hour behind Tokyo. Eastern Australia runs two to three hours ahead, which still leaves most of a day in common. European mornings land in his evening.",
  },
  {
    question: "What kind of role is he looking for?",
    answer:
      "Fullstack TypeScript, owned end to end: Next.js on the front, NestJS on the back, one person carrying a feature from spec to production. He is open to frontend-only and backend-only roles as well, but the fullstack shape is the one he is aiming at.",
  },
  {
    question: "What matters to him beyond the stack?",
    answer:
      "Three things. Room to shape the spec and the architecture rather than picking up finished tickets. A team where testing and code review are routine rather than aspirational. And a product whose impact is visible, where a domain is worth learning properly instead of changing every few months.",
  },
];
