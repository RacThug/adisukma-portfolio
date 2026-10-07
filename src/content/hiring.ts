import { site } from "@/content/site";

export interface ClientAnswer {
  /** The question in a client's own words, not ours. */
  question: string;
  /** Adi's own answer. One or two sentences, same voice as the rest of the site. */
  answer: string;
}

/**
 * The questions the rest of the site cannot structurally answer.
 *
 * Every other content module describes work that has already happened. These
 * describe how freelance work happens, which no project write-up implies and
 * the bot is explicitly forbidden from inferring: a stack list does not say
 * whether he would relocate, and an end date on an old role does not say when
 * he can start.
 *
 * Two rules for editing this file. Write answers Adi would be happy to see
 * quoted back at him, because they will be. And never restate a fact another
 * module already owns: if a date lives in `experience.ts`, refer to it, do not
 * copy it. A copied fact is a fact that rots.
 *
 * Rates, timelines, a start date, and any current employer are deliberately
 * absent. Do not add them here unless Adi has written the answer down.
 */
export const clientFaq: ClientAnswer[] = [
  {
    question: "What kind of projects does he take?",
    answer:
      "Websites and web apps owned end to end: Next.js on the front, NestJS or PHP/Symfony on the back, one person carrying a feature from spec to production. The projects on this site are the examples, and he takes frontend-only and backend-only work as well, though fullstack is the shape he is aiming at.",
  },
  {
    question: "What does he build with?",
    answer:
      "TypeScript, with Next.js and React on the frontend and NestJS and Node.js on the backend. He is comfortable in PHP and Symfony too, and the skills section lists the rest.",
  },
  {
    question: "Does he work remotely, or on-site?",
    answer:
      "Denpasar, Bali, on UTC+8. He takes remote work anywhere, and on-site or hybrid work around Bali, and he is not looking to relocate, so a project based elsewhere would need to be remote.",
  },
  {
    question: "How well do his hours overlap with other timezones?",
    answer:
      "UTC+8 is the same working clock as Singapore, Kuala Lumpur, and Perth, an hour ahead of Jakarta, and an hour behind Tokyo. Eastern Australia runs two to three hours ahead, which still leaves most of a day in common. European mornings land in his evening.",
  },
  {
    question: "How do you start a project with him?",
    answer: `Email him at ${site.email}, or message him on LinkedIn. Rates, timelines, and a start date are not published on this site.`,
  },
];
