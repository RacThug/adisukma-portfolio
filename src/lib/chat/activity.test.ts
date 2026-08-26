import { afterEach, describe, expect, it, vi } from "vitest";

import { featuredRepos } from "@/content/github";

import { buildActivityFacts } from "./activity";
import { buildCorpus } from "./corpus";
import { buildSystemPrompt } from "./prompt";

const NOW = new Date("2026-08-26T12:00:00Z");

function respondWith(body: unknown, ok = true) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok, json: async () => body } as Response),
  );
}

function repo(name: string, pushedAt: string, overrides: Record<string, unknown> = {}) {
  return {
    name,
    description: "A repository",
    language: "TypeScript",
    html_url: `https://github.com/RacThug/${name}`,
    pushed_at: pushedAt,
    fork: false,
    ...overrides,
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("buildActivityFacts", () => {
  it("states each repo, when it was pushed, and where to find it", async () => {
    respondWith([repo(featuredRepos[0], "2026-08-25T00:00:00Z")]);
    const facts = await buildActivityFacts(NOW);

    expect(facts).toContain(featuredRepos[0]);
    expect(facts).toContain("yesterday");
    expect(facts).toContain(`https://github.com/RacThug/${featuredRepos[0]}`);
  });

  describe("says nothing rather than something wrong", () => {
    // An empty string appends nothing and the prompt is exactly what it was
    // before. The bot carries on knowing slightly less, and nobody notices -
    // which is the correct amount of noticing.

    it("is empty when GitHub is unreachable", async () => {
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));
      await expect(buildActivityFacts(NOW)).resolves.toBe("");
    });

    it("is empty when the allowlist matches nothing", async () => {
      respondWith([repo("basic-blackjack-game", "2026-08-25T00:00:00Z")]);
      await expect(buildActivityFacts(NOW)).resolves.toBe("");
    });

    it("never claims the list is everything he has written", async () => {
      // It is an allowlist of two against two dozen public repos. A bot that
      // presents it as complete is inviting "so that's all he's built?".
      respondWith([repo(featuredRepos[0], "2026-08-25T00:00:00Z")]);
      expect(await buildActivityFacts(NOW)).toMatch(/not a complete list/i);
    });
  });

  it("has no unfilled holes when a repo has no description or language", async () => {
    respondWith([
      repo(featuredRepos[0], "2026-08-25T00:00:00Z", { description: null, language: null }),
    ]);
    const facts = await buildActivityFacts(NOW);
    expect(facts).not.toContain("null");
    expect(facts).not.toContain("undefined");
  });
});

describe("the seam between written facts and live ones", () => {
  // The Corpus is a pure function of this repository; the activity facts are
  // not. Keeping them separate is what lets corpus.test.ts assert the Corpus is
  // exactly the site, with no network call in the unit suite. See activity.ts.

  it("leaves the Corpus untouched", async () => {
    respondWith([repo(featuredRepos[0], "2026-08-25T00:00:00Z")]);
    const facts = await buildActivityFacts(NOW);
    expect(buildCorpus()).not.toContain(facts.trim());
  });

  it("appends after the Corpus, never inside it", async () => {
    respondWith([repo(featuredRepos[0], "2026-08-25T00:00:00Z")]);
    const facts = await buildActivityFacts(NOW);
    const prompt = buildSystemPrompt(facts);

    expect(prompt).toContain(buildCorpus());
    expect(prompt.indexOf(buildCorpus())).toBeLessThan(prompt.indexOf(facts.trim()));
  });

  it("produces the prompt it always produced when there are no live facts", () => {
    expect(buildSystemPrompt("")).toBe(buildSystemPrompt());
  });
});
