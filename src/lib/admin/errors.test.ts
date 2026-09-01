import { describe, expect, it } from "vitest";

import { experienceFileSchema } from "@/content/experience";
import { projectsSchema } from "@/content/projects";
import { siteSchema } from "@/content/site";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { invalid, stripPrefix } from "./errors";

describe("invalid", () => {
  it("keys each issue by the input name the form rendered", () => {
    const result = siteSchema.safeParse({ ...site, email: "nope", tagline: { ...site.tagline, highlight: "" } });
    expect(result.success).toBe(false);
    const state = invalid(result.error!);
    expect(state.status).toBe("error");
    if (state.status !== "error") return;
    expect(Object.keys(state.fields).sort()).toEqual(["email", "tagline.highlight"]);
    expect(state.message).toBe("Not saved: 2 fields need attention.");
  });

  it("routes a whole-list refinement to the form-level message", () => {
    const result = projectsSchema.safeParse([projects[0], projects[0]]);
    expect(result.success).toBe(false);
    const state = invalid(result.error!);
    if (state.status !== "error") throw new Error("expected error state");
    expect(state.fields).toEqual({});
    expect(state.message).toBe("project slugs must be unique");
  });

  it("strips the file-schema wrapper so paths match repeated-fieldset names", () => {
    const broken = {
      experience: [{ title: "", company: "x", meta: "x", period: "x", description: "x" }],
      education: { school: "x", degree: "x" },
    };
    const result = experienceFileSchema.safeParse(broken);
    expect(result.success).toBe(false);
    const state = invalid(result.error!, stripPrefix("experience"));
    if (state.status !== "error") throw new Error("expected error state");
    expect(Object.keys(state.fields)).toEqual(["0.title"]);
  });
});
