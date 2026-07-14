import { describe, expect, it } from "vitest";

import { site } from "@/content/site";

import { HANDOFF } from "./copy";
import { buildCorpus } from "./corpus";
import { buildSystemPrompt } from "./prompt";

const prompt = buildSystemPrompt();

describe("buildSystemPrompt", () => {
  it("carries the whole Corpus", () => {
    expect(prompt).toContain(buildCorpus());
  });

  it("states the Handoff verbatim, so the model copies it rather than paraphrasing", () => {
    expect(prompt).toContain(HANDOFF);
  });

  it("cannot drift from the real contact address", () => {
    // The Handoff is the one place the bot hands a recruiter a way to reach
    // Adi. A stale address here is a silently broken feature.
    expect(HANDOFF).toContain(site.email);
  });

  it("forbids denying an unlisted skill", () => {
    expect(prompt).toMatch(/never deny a skill/i);
    expect(prompt).toMatch(/isn't listed/i);
  });

  it("forbids inference", () => {
    expect(prompt).toMatch(/never infer/i);
  });

  it("forbids markdown, because the widget renders raw text", () => {
    // The bot shipped writing "*   **Programmer / Web Developer**", which a
    // recruiter saw as literal asterisks. The panel renders plain text by
    // design; the model has to know that.
    expect(prompt).toMatch(/no markdown/i);
  });

  it("puts behaviour before facts", () => {
    // The model reads top-down. Rules must be established before the material
    // they govern, not appended as an afterthought.
    expect(prompt.indexOf("The rule you never break")).toBeLessThan(prompt.indexOf("# FACTS"));
  });
});
