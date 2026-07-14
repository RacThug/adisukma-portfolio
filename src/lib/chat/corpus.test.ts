import { describe, expect, it } from "vitest";

import { experience, education } from "@/content/experience";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { skillGroups } from "@/content/skills";

import { buildCorpus } from "./corpus";

const corpus = buildCorpus();

describe("buildCorpus", () => {
  describe("is a complete projection of src/content", () => {
    // These loops are the point. They are not exhaustive listings of today's
    // content - they are a structural guarantee that any fact added to
    // src/content reaches the bot, and any fact removed leaves it. Adding a
    // project to projects.ts extends this test for free. See ADR 0001.

    it.each(projects)("carries the $title project in full", (project) => {
      expect(corpus).toContain(project.title);
      expect(corpus).toContain(project.problem);
      expect(corpus).toContain(project.built);
      for (const highlight of project.highlights) {
        expect(corpus).toContain(highlight);
      }
      for (const tech of project.tech) {
        expect(corpus).toContain(tech);
      }
    });

    it.each(experience)("carries the $company role", (entry) => {
      expect(corpus).toContain(entry.company);
      expect(corpus).toContain(entry.title);
      expect(corpus).toContain(entry.period);
      expect(corpus).toContain(entry.description);
    });

    it.each(skillGroups)("carries the $label skill group", (group) => {
      expect(corpus).toContain(group.label);
      for (const item of group.items) {
        expect(corpus).toContain(item);
      }
    });

    it("carries identity, contact and availability", () => {
      expect(corpus).toContain(site.name);
      expect(corpus).toContain(site.role);
      expect(corpus).toContain(site.location);
      expect(corpus).toContain(site.email);
      expect(corpus).toContain(site.availability);
      expect(corpus).toContain(site.github);
      expect(corpus).toContain(site.linkedin);
    });

    it("carries the long bio", () => {
      for (const paragraph of site.longBio) {
        expect(corpus).toContain(paragraph);
      }
    });

    it("carries education", () => {
      expect(corpus).toContain(education.school);
      expect(corpus).toContain(education.degree);
    });
  });

  describe("cannot drift from the site", () => {
    // The failure this guards against already happened once. A stale
    // docs/portfolio-content-reference.md described a "Renovation Sales
    // Platform" and AI-first branding for months after both were removed from
    // the site in 3c77ca4. A bot fed that file would confidently tell
    // recruiters about work Adi deleted. See ADR 0001.

    it("does not know about the removed Renovation Sales Platform", () => {
      expect(corpus).not.toMatch(/renovation/i);
    });

    it("does not carry the removed AI-first branding", () => {
      expect(corpus).not.toMatch(/ai-first/i);
    });

    it("describes exactly the projects the site ships, and no others", () => {
      const headings = corpus.match(/^### /gm) ?? [];
      expect(headings).toHaveLength(projects.length);
    });
  });

  describe("is shaped for a system prompt", () => {
    it("is small enough to stuff whole", () => {
      // ~1,000 words of prose. If this ever approaches a context window we
      // have a different architecture, not a bigger prompt. See ADR 0001.
      expect(corpus.length).toBeLessThan(12_000);
    });

    it("is deterministic", () => {
      expect(buildCorpus()).toBe(corpus);
    });

    it("has no unfilled template holes", () => {
      expect(corpus).not.toContain("undefined");
      expect(corpus).not.toContain("[object Object]");
    });
  });
});
