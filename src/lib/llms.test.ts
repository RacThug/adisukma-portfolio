import { describe, expect, it } from "vitest";

import { projects } from "@/content/projects";
import { site } from "@/content/site";

import { buildLlmsTxt } from "./llms";

const llms = buildLlmsTxt();

describe("llms.txt", () => {
  it("names him, how to reach him, and the freelance offer", () => {
    expect(llms).toContain(site.name);
    expect(llms).toContain(site.fullName);
    expect(llms).toContain(site.email);
    expect(llms).toContain(site.linkedin);
    expect(llms).toContain(site.github);
    expect(llms).toContain(site.availability);
    expect(llms).toContain(`${site.url}/services`);
  });

  it("links every project from the content module", () => {
    for (const project of projects) {
      expect(llms).toContain(`${site.url}/projects/${project.slug}`);
      expect(llms).toContain(project.title);
    }
  });

  it("does not revive the job-search positioning", () => {
    expect(llms).not.toMatch(/open to work/i);
    expect(llms).not.toMatch(/most recent role has ended/i);
    expect(llms).not.toMatch(/no notice period/i);
    expect(llms).not.toMatch(/ini vie/i);
  });

  it("is deterministic", () => {
    expect(buildLlmsTxt()).toBe(llms);
  });
});
