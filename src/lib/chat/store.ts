import { Redis } from "@upstash/redis";

import { QUESTION_TTL_DAYS } from "./copy";

const DEFAULT_DAILY_BUDGET = 800;

/**
 * How many model calls we will make in a day before we stop.
 *
 * Deliberately below the provider's own free ceiling. The point is that running
 * out becomes a decision we made, at a moment we chose, with a Handoff ready -
 * rather than an error we discover from a 429 in front of a recruiter.
 *
 * Parsed defensively, because the naive `Number(env ?? 800)` has a nasty
 * property: a typo'd value yields `NaN`, every `used <= NaN` is `false`, and the
 * bot is silently and permanently out of budget. A mistyped environment variable
 * should not be a kill switch.
 */
export function readDailyBudget(env: Record<string, string | undefined> = process.env): number {
  const parsed = Number(env.CHAT_DAILY_BUDGET);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_DAILY_BUDGET;
}

/** Questions expire. They have told you what they were going to tell you. */
const QUESTION_TTL_SECONDS = QUESTION_TTL_DAYS * 24 * 60 * 60;

/** A flood of junk must not fill the free tier. */
const MAX_DISTINCT_QUESTIONS_PER_DAY = 500;

/** The longest question fragment worth keeping. */
const MAX_LOGGED_CHARS = 200;

/** UTC day. Coarser than a timestamp on purpose - see docs/adr/0004. */
export function dayOf(now: Date): string {
  return now.toISOString().slice(0, 10);
}

export function budgetKey(now: Date): string {
  return `chat:budget:${dayOf(now)}`;
}

export function questionKey(now: Date): string {
  return `chat:questions:${dayOf(now)}`;
}

/**
 * What actually gets stored: lowercased, whitespace-collapsed, truncated.
 *
 * Normalising is not only tidiness. It is what lets the log be a *frequency
 * table* rather than a transcript - "kubernetes?" and "Kubernetes?" collapse to
 * one row with a count of two. Counting is the entire point (docs/adr/0004): if
 * forty people ask about a skill the site never mentions, that is a portfolio
 * gap. Counts answer that. Transcripts are not needed to answer it, so we do
 * not keep them.
 */
export function normalizeQuestion(text: string): string {
  return text.trim().replace(/\s+/g, " ").toLowerCase().slice(0, MAX_LOGGED_CHARS);
}

let cached: Redis | null | undefined;

/** `null` when Upstash is not configured - the site must still work without it. */
function redis(): Redis | null {
  if (cached !== undefined) return cached;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  cached = url && token ? new Redis({ url, token }) : null;
  return cached;
}

/**
 * The circuit-breaker. Increments today's counter and reports whether we are
 * still under budget.
 *
 * **Fails open.** If Redis is unreachable - or simply not configured - this
 * returns `true` and the request proceeds. That is deliberate. The breaker is
 * the *last* line of defence for quota, not the first: the Vercel WAF rule
 * still stands at the edge, and it runs before this code exists. Letting a
 * cache outage take down the feature a recruiter came to use would trade a
 * small, recoverable problem for the exact failure this whole feature exists to
 * prevent.
 */
export async function withinBudget(now = new Date()): Promise<boolean> {
  const client = redis();
  if (!client) return true;

  try {
    const key = budgetKey(now);
    const used = await client.incr(key);
    if (used === 1) {
      // First call of the day. Keep the key just long enough to outlive the day
      // it counts; nothing reads it afterwards.
      await client.expire(key, 2 * 24 * 60 * 60);
    }
    return used <= readDailyBudget();
  } catch {
    return true;
  }
}

/**
 * Record that *a* Visitor asked *this*. Not who, not when beyond the day, not
 * what we answered, and not what they asked before or after. See docs/adr/0004
 * for why each of those absences is load-bearing rather than lazy.
 *
 * Never throws. The route runs it via `after()`, so it cannot sit between a
 * Visitor and their answer either - and a failed write costs us one row of the
 * Question Log, which is not a thing worth an error path.
 */
export async function logQuestion(text: string, now = new Date()): Promise<void> {
  const client = redis();
  if (!client) return;

  const question = normalizeQuestion(text);
  if (question.length === 0) return;

  try {
    const key = questionKey(now);
    const distinct = await client.hlen(key);
    if (distinct >= MAX_DISTINCT_QUESTIONS_PER_DAY) return;

    await client.hincrby(key, question, 1);
    await client.expire(key, QUESTION_TTL_SECONDS);
  } catch {
    // One lost row of the Question Log. Nobody is waiting on it.
  }
}
