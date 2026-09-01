import { describe, expect, it } from "vitest";

import { experience, education, experienceFileSchema } from "@/content/experience";
import { hiringFaq, hiringFaqSchema } from "@/content/hiring";
import { projects, projectSchema } from "@/content/projects";
import { site, siteSchema } from "@/content/site";
import {
  decodeExperienceFile,
  decodeHiringList,
  decodeProject,
  decodeSite,
  lines,
} from "./forms";

/**
 * The admin's whole promise is that a save with nothing changed writes
 * nothing changed. So the decoders are tested as round-trips against the
 * real content: fill a form the way the pages would render it, decode, and
 * expect exactly the object that is already on disk.
 */

function siteForm(): FormData {
  const fd = new FormData();
  fd.set("name", site.name);
  fd.set("role", site.role);
  fd.set("location", site.location);
  fd.set("email", site.email);
  fd.set("linkedin", site.linkedin);
  fd.set("github", site.github);
  fd.set("url", site.url);
  fd.set("availability", site.availability);
  fd.set("tagline.pre", site.tagline.pre);
  fd.set("tagline.highlight", site.tagline.highlight);
  fd.set("tagline.post", site.tagline.post);
  fd.set("intro", site.intro);
  fd.set("shortBio", site.shortBio);
  fd.set("longBio", site.longBio.join("\n\n"));
  fd.set("cvPath", site.cvPath);
  fd.set("cvDownloadName", site.cvDownloadName);
  return fd;
}

describe("decodeSite", () => {
  it("round-trips the shipped content unchanged", () => {
    expect(siteSchema.parse(decodeSite(siteForm()))).toEqual(site);
  });

  it("preserves the tagline's edge whitespace", () => {
    const decoded = siteSchema.parse(decodeSite(siteForm()));
    expect(decoded.tagline.pre).toBe(site.tagline.pre);
    expect(decoded.tagline.post).toBe(site.tagline.post);
  });
});

describe("decodeProject", () => {
  function projectForm(p: (typeof projects)[number]): FormData {
    const fd = new FormData();
    fd.set("slug", p.slug);
    fd.set("index", p.index);
    fd.set("title", p.title);
    fd.set("type", p.type);
    fd.set("role", p.role);
    fd.set("summary", p.summary);
    fd.set("problem", p.problem);
    fd.set("built", p.built);
    fd.set("highlights", p.highlights.join("\n"));
    fd.set("tech", p.tech.join("\n"));
    fd.set("featuredTech", p.featuredTech.join("\n"));
    fd.set("liveUrl", p.liveUrl ?? "");
    fd.set("repoUrl", p.repoUrl ?? "");
    return fd;
  }

  it("round-trips every shipped project unchanged", () => {
    for (const project of projects) {
      expect(projectSchema.parse(decodeProject(projectForm(project)))).toEqual(project);
    }
  });

  it("drops an emptied optional URL instead of storing an empty string", () => {
    const withUrls = projects.find((p) => p.liveUrl !== undefined);
    expect(withUrls).toBeDefined();
    const fd = projectForm(withUrls!);
    fd.set("liveUrl", "");
    const decoded = projectSchema.parse(decodeProject(fd));
    expect("liveUrl" in decoded && decoded.liveUrl !== undefined).toBe(false);
  });
});

describe("decodeExperienceFile", () => {
  function experienceForm(): FormData {
    const fd = new FormData();
    fd.set("count", String(experience.length + 1));
    experience.forEach((entry, i) => {
      fd.set(`${i}.title`, entry.title);
      fd.set(`${i}.company`, entry.company);
      fd.set(`${i}.meta`, entry.meta);
      fd.set(`${i}.period`, entry.period);
      if (entry.current) fd.set(`${i}.current`, "on");
      fd.set(`${i}.description`, entry.description);
      fd.set(`${i}.stack`, entry.stack ?? "");
    });
    fd.set("education.school", education.school);
    fd.set("education.degree", education.degree);
    return fd;
  }

  it("round-trips the shipped content, skipping the blank 'new entry' row", () => {
    expect(experienceFileSchema.parse(decodeExperienceFile(experienceForm()))).toEqual({
      experience,
      education,
    });
  });

  it("treats a cleared entry as a deletion", () => {
    const fd = experienceForm();
    fd.set("0.title", "");
    fd.set("0.company", "");
    fd.set("0.description", "");
    const decoded = experienceFileSchema.parse(decodeExperienceFile(fd));
    expect(decoded.experience).toEqual(experience.slice(1));
  });
});

describe("decodeHiringList", () => {
  it("round-trips the shipped content", () => {
    const fd = new FormData();
    fd.set("count", String(hiringFaq.length + 1));
    hiringFaq.forEach((entry, i) => {
      fd.set(`${i}.question`, entry.question);
      fd.set(`${i}.answer`, entry.answer);
    });
    expect(hiringFaqSchema.parse(decodeHiringList(fd))).toEqual(hiringFaq);
  });
});

describe("lines", () => {
  it("splits on newlines, trims, and drops blanks", () => {
    const fd = new FormData();
    fd.set("items", "  one \r\n\r\ntwo\n   \nthree  ");
    expect(lines(fd, "items")).toEqual(["one", "two", "three"]);
  });
});
