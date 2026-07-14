import { describe, expect, it } from "vitest";

import {
  budgetKey,
  dayOf,
  normalizeQuestion,
  questionKey,
  readDailyBudget,
  withinBudget,
} from "./store";

const NOON = new Date("2026-07-14T12:00:00Z");
const LATE = new Date("2026-07-14T23:59:59Z");

describe("dayOf", () => {
  it("buckets by UTC day, not by the hour", () => {
    // Coarse on purpose. A precise timestamp is a step toward identifying who
    // asked; the day is all the resolution the Question Log needs. See ADR 0004.
    expect(dayOf(NOON)).toBe("2026-07-14");
    expect(dayOf(LATE)).toBe(dayOf(NOON));
  });
});

describe("keys", () => {
  it("scopes the budget and the questions to the day", () => {
    expect(budgetKey(NOON)).toBe("chat:budget:2026-07-14");
    expect(questionKey(NOON)).toBe("chat:questions:2026-07-14");
  });
});

describe("normalizeQuestion", () => {
  it("collapses casing and whitespace so the log counts rather than transcribes", () => {
    expect(normalizeQuestion("  Does   he know\nKubernetes? ")).toBe("does he know kubernetes?");
  });

  it("collapses variants of the same question onto one row", () => {
    expect(normalizeQuestion("Kubernetes?")).toBe(normalizeQuestion("  kubernetes?  "));
  });

  it("truncates, so nobody can paste a novel into the log", () => {
    expect(normalizeQuestion("a".repeat(500))).toHaveLength(200);
  });
});

describe("readDailyBudget", () => {
  it("reads a configured budget", () => {
    expect(readDailyBudget({ CHAT_DAILY_BUDGET: "250" })).toBe(250);
  });

  it("falls back to the default when unset", () => {
    expect(readDailyBudget({})).toBe(800);
  });

  it.each([
    ["a typo", "80O"],
    ["empty", ""],
    ["whitespace", "   "],
    ["nonsense", "eight hundred"],
    ["zero", "0"],
    ["negative", "-5"],
  ])("survives %s rather than becoming a silent kill switch", (_label, value) => {
    // The naive `Number(env ?? 800)` returns NaN here. Every `used <= NaN` is
    // false, so the bot would be permanently, silently out of budget - a
    // mistyped environment variable that takes the feature offline and reports
    // nothing. It must degrade to the default instead.
    const budget = readDailyBudget({ CHAT_DAILY_BUDGET: value });
    expect(budget).toBe(800);
    expect(1 <= budget).toBe(true);
  });
});

describe("withinBudget", () => {
  it("allows the request when Upstash is not configured", async () => {
    // Fails open, by design. The circuit-breaker is the last line for quota,
    // not the first - the WAF rule runs at the edge before this code exists.
    // A missing cache must never take down the thing a recruiter came to use.
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    await expect(withinBudget(NOON)).resolves.toBe(true);
  });
});
