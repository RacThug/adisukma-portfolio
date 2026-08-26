import { afterEach, describe, expect, it, vi } from "vitest";

import { featuredRepos } from "@/content/github";
import { projects } from "@/content/projects";

import { excludeWrittenUp, fetchRepoActivity, repoKey, timeAgo } from "./github";

/** A repo shaped the way GitHub shapes them, named whatever we need. */
function repo(name: string, overrides: Record<string, unknown> = {}) {
  return {
    name,
    description: `${name} description`,
    language: "TypeScript",
    html_url: `https://github.com/RacThug/${name}`,
    pushed_at: "2026-08-01T00:00:00Z",
    fork: false,
    ...overrides,
  };
}

function respondWith(body: unknown, ok = true) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok, json: async () => body } as Response),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchRepoActivity", () => {
  describe("shows only what the allowlist names", () => {
    // The reason this function exists. The account holds two dozen public repos,
    // most of them practice - a meme picker, a blackjack game. Sorting by push
    // date and taking the top few would put those in front of a recruiter next
    // to four written-up case studies. See src/content/github.ts.

    it("drops a repo nobody put on the list", async () => {
      respondWith([repo(featuredRepos[0]), repo("basic-meme-picker")]);
      const result = await fetchRepoActivity();
      expect(result.map((r) => r.name)).toEqual([featuredRepos[0]]);
    });

    it("drops a fork even when it is on the list", async () => {
      respondWith([repo(featuredRepos[0], { fork: true })]);
      await expect(fetchRepoActivity()).resolves.toEqual([]);
    });

    it("costs one request no matter how long the allowlist is", async () => {
      // The list endpoint, filtered locally. Asking per name would make the
      // rate-limit budget scale with the allowlist, which is backwards.
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] } as Response);
      vi.stubGlobal("fetch", fetchMock);
      await fetchRepoActivity();
      expect(fetchMock).toHaveBeenCalledOnce();
    });
  });

  it("puts the most recently pushed first", async () => {
    const [first, second] = featuredRepos;
    respondWith([
      repo(first, { pushed_at: "2026-01-01T00:00:00Z" }),
      repo(second, { pushed_at: "2026-08-20T00:00:00Z" }),
    ]);
    const result = await fetchRepoActivity();
    expect(result.map((r) => r.name)).toEqual([second, first]);
  });

  describe("fails open, every way it can fail", () => {
    // This runs on the page a recruiter came to read and inside the chat route
    // that must always answer. Neither may break because GitHub did. Same
    // instinct as the circuit-breaker in chat/store.ts.

    it("returns nothing when GitHub is rate-limiting us", async () => {
      respondWith({ message: "API rate limit exceeded" }, false);
      await expect(fetchRepoActivity()).resolves.toEqual([]);
    });

    it("returns nothing when the network is gone", async () => {
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));
      await expect(fetchRepoActivity()).resolves.toEqual([]);
    });

    it("returns nothing when the body is not the array we expected", async () => {
      respondWith({ message: "Not Found" });
      await expect(fetchRepoActivity()).resolves.toEqual([]);
    });

    it("skips a malformed entry rather than throwing on it", async () => {
      respondWith([{ name: featuredRepos[0] }, repo(featuredRepos[0])]);
      const result = await fetchRepoActivity();
      expect(result).toHaveLength(1);
      expect(result[0].pushedAt).toBe("2026-08-01T00:00:00Z");
    });
  });
});

describe("excludeWrittenUp", () => {
  // The word "also" in "also public on github" has to be true. dewasa-ayu is
  // linked from its own case study; listing it again one section below adds
  // nothing and makes the body of work look half its size.

  const activity = (url: string) => [
    { name: "x", description: null, language: null, url, pushedAt: "2026-08-01T00:00:00Z" },
  ];

  it("drops a repo a project already links to", () => {
    expect(excludeWrittenUp(activity("https://github.com/a/b"), ["https://github.com/a/b"])).toEqual(
      [],
    );
  });

  it("keeps a repo no project mentions", () => {
    expect(excludeWrittenUp(activity("https://github.com/a/b"), ["https://github.com/a/c"])).toHaveLength(1);
  });

  it("survives a project with no repo at all", () => {
    // Three of four projects are client work with nothing public.
    expect(excludeWrittenUp(activity("https://github.com/a/b"), [undefined, undefined])).toHaveLength(1);
  });

  it.each([
    "https://github.com/A/B",
    "https://github.com/a/b/",
    "https://github.com/a/b.git",
  ])("matches %s despite the cosmetic difference", (written) => {
    // A URL a human typed and a URL GitHub returned point at the same repo and
    // differ in case, a trailing slash, or a .git suffix. `===` would miss all
    // three, and a miss here is the duplicate this function exists to prevent.
    expect(excludeWrittenUp(activity("https://github.com/a/b"), [written])).toEqual([]);
  });

  it("holds for the real content, not just fixtures", () => {
    // If a repo is both allowlisted and written up, it must not survive. This
    // is the assertion that would have caught the duplicate on the live page.
    const linked = projects.flatMap((p) => (p.repoUrl ? [p.repoUrl] : []));
    const overlapping = linked.filter((url) =>
      (featuredRepos as readonly string[]).some((name) => repoKey(url).endsWith(`/${name}`)),
    );
    const survivors = excludeWrittenUp(
      overlapping.flatMap((url) => activity(url)),
      linked,
    );
    expect(survivors).toEqual([]);
  });
});

describe("timeAgo", () => {
  const now = new Date("2026-08-26T12:00:00Z");
  const daysBefore = (days: number) =>
    new Date(now.getTime() - days * 86_400_000).toISOString();

  it.each([
    [0, "today"],
    [1, "yesterday"],
    [3, "3 days ago"],
    [9, "last week"],
    [30, "4 weeks ago"],
    [120, "4 months ago"],
    [500, "over a year ago"],
  ])("%i days ago reads as %s", (days, expected) => {
    expect(timeAgo(daysBefore(days), now)).toBe(expected);
  });

  it("does not claim the future", () => {
    // Clock skew between GitHub and us is real and small. "in -1 days" is not.
    expect(timeAgo(new Date(now.getTime() + 60_000).toISOString(), now)).toBe("recently");
  });

  it("does not throw on a date it cannot read", () => {
    expect(timeAgo("not a date", now)).toBe("recently");
  });
});
