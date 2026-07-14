import { APICallError } from "ai";
import { describe, expect, it } from "vitest";

import { isRetryable, readProviders } from "./providers";

const FULL_ENV = {
  CHAT_PRIMARY_BASE_URL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  CHAT_PRIMARY_API_KEY: "gemini-key",
  CHAT_PRIMARY_MODEL: "gemini-flash-lite-latest",
  CHAT_FALLBACK_BASE_URL: "https://openrouter.ai/api/v1",
  CHAT_FALLBACK_API_KEY: "openrouter-key",
  CHAT_FALLBACK_MODEL: "some/free-model:free",
};

function apiError(statusCode: number | undefined) {
  return new APICallError({
    message: "boom",
    url: "https://example.com",
    requestBodyValues: {},
    statusCode,
  });
}

describe("readProviders", () => {
  it("reads the chain in order: primary first, fallback second", () => {
    const providers = readProviders(FULL_ENV);
    expect(providers.map((p) => p.name)).toEqual(["primary", "fallback"]);
    expect(providers[0].model).toBe("gemini-flash-lite-latest");
  });

  it("works with only a primary configured", () => {
    const providers = readProviders({
      CHAT_PRIMARY_BASE_URL: FULL_ENV.CHAT_PRIMARY_BASE_URL,
      CHAT_PRIMARY_API_KEY: FULL_ENV.CHAT_PRIMARY_API_KEY,
      CHAT_PRIMARY_MODEL: FULL_ENV.CHAT_PRIMARY_MODEL,
    });
    expect(providers.map((p) => p.name)).toEqual(["primary"]);
  });

  it("drops a half-configured slot rather than building a broken provider", () => {
    // A fallback missing its key is not a fallback. Better absent than
    // present-and-guaranteed-to-401 at the worst possible moment.
    const providers = readProviders({ ...FULL_ENV, CHAT_FALLBACK_API_KEY: undefined });
    expect(providers.map((p) => p.name)).toEqual(["primary"]);
  });

  it("returns nothing when unconfigured, so the route can Handoff instead of crashing", () => {
    expect(readProviders({})).toEqual([]);
  });
});

describe("isRetryable", () => {
  it.each([
    ["429 rate limited", 429],
    ["408 timeout", 408],
    ["500 server error", 500],
    ["503 unavailable", 503],
  ])("retries on %s - another provider may be fine", (_label, status) => {
    expect(isRetryable(apiError(status))).toBe(true);
  });

  it.each([
    ["400 bad request", 400],
    ["401 unauthorized", 401],
    ["404 unknown model", 404],
  ])("does not retry on %s - it will fail identically next door", (_label, status) => {
    expect(isRetryable(apiError(status))).toBe(false);
  });

  it("retries when the request never reached a server", () => {
    expect(isRetryable(apiError(undefined))).toBe(true);
  });

  it("retries on a network failure", () => {
    expect(isRetryable(new TypeError("fetch failed"))).toBe(true);
  });

  it("retries on an abort", () => {
    const aborted = new Error("aborted");
    aborted.name = "AbortError";
    expect(isRetryable(aborted)).toBe(true);
  });

  it("does not retry on our own bugs", () => {
    // A ReferenceError is not an outage. Retrying it would drain the fallback
    // quota to reproduce the same crash.
    expect(isRetryable(new ReferenceError("x is not defined"))).toBe(false);
    expect(isRetryable("a string")).toBe(false);
  });
});
