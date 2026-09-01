import { describe, expect, it } from "vitest";

import { experience } from "./experience";
import { hiringFaq } from "./hiring";
import { projects, projectSchema, projectsSchema } from "./projects";
import { site, siteSchema } from "./site";
import { skillGroups } from "./skills";

/**
 * The schemas are what stand between a hand-edited (or, later, admin-written)
 * JSON file and the pages plus the chatbot corpus. Importing the modules above
 * already proves the shipped JSON parses; these tests prove the schemas would
 * actually catch a corrupted file rather than wave it through.
 */
describe("content accessors", () => {
  it("expose the parsed content", () => {
    expect(projects.length).toBeGreaterThan(0);
    expect(experience.length).toBeGreaterThan(0);
    expect(hiringFaq.length).toBeGreaterThan(0);
    expect(skillGroups.length).toBeGreaterThan(0);
    expect(site.name.length).toBeGreaterThan(0);
  });
});

describe("project schema", () => {
  const valid = projects[0];

  it("rejects a missing required field", () => {
    const withoutTitle: Record<string, unknown> = { ...valid };
    delete withoutTitle.title;
    expect(projectSchema.safeParse(withoutTitle).success).toBe(false);
  });

  it("rejects an empty title", () => {
    expect(projectSchema.safeParse({ ...valid, title: "" }).success).toBe(false);
  });

  it("rejects an unknown key, so a typo cannot silently drop a field", () => {
    expect(projectSchema.safeParse({ ...valid, titel: "oops" }).success).toBe(false);
  });

  it("rejects a malformed live URL", () => {
    expect(projectSchema.safeParse({ ...valid, liveUrl: "not-a-url" }).success).toBe(false);
  });

  it("rejects duplicate slugs across the list", () => {
    expect(projectsSchema.safeParse([valid, valid]).success).toBe(false);
  });
});

describe("site schema", () => {
  it("rejects a malformed email", () => {
    expect(siteSchema.safeParse({ ...site, email: "not-an-email" }).success).toBe(false);
  });

  it("rejects a wrongly-typed field", () => {
    expect(siteSchema.safeParse({ ...site, longBio: "one string" }).success).toBe(false);
  });
});
