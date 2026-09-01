import { z } from "zod";
import data from "./hiring.json";

export const hiringAnswerSchema = z.strictObject({
  /** The question in a hiring partner's own words, not ours. */
  question: z.string().min(1),
  /** Adi's own answer. One or two sentences, same voice as the rest of the site. */
  answer: z.string().min(1),
});

export type HiringAnswer = z.infer<typeof hiringAnswerSchema>;

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
 * Two rules for editing `hiring.json`. Write answers Adi would be happy to see
 * quoted back at him in a first call, because they will be. And never restate a
 * fact another module already owns: if a date lives in `experience.json`, refer
 * to it, do not copy it. A copied fact is a fact that rots.
 */
export const hiringFaq: HiringAnswer[] = z.array(hiringAnswerSchema).min(1).parse(data);
