import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { homeJsonLd, projectJsonLd, servicesJsonLd } from "@/lib/structured-data";

/** Google truncates a snippet around here. Stay under it. */
const MAX_DESCRIPTION = 155;

describe("search snippets", () => {
  it("keeps the home description inside a snippet", () => {
    expect(site.description.length).toBeLessThanOrEqual(MAX_DESCRIPTION);
    expect(site.description.length).toBeGreaterThan(120);
    expect(site.title.length).toBeLessThanOrEqual(60);
  });

  it("keeps the services description inside a snippet", () => {
    expect(site.servicesDescription.length).toBeLessThanOrEqual(MAX_DESCRIPTION);
    expect(site.servicesDescription.length).toBeGreaterThan(120);
  });

  it.each(projects)("keeps the $slug description inside a snippet", (project) => {
    expect(project.seoDescription.length).toBeLessThanOrEqual(MAX_DESCRIPTION);
    expect(project.seoDescription.length).toBeGreaterThan(100);
  });
});

describe("sitemap", () => {
  const entries = sitemap();

  it("does not stamp lastModified at build time", () => {
    for (const entry of entries) {
      expect(entry.lastModified).toBeUndefined();
    }
  });

  it("lists home, services, and every project", () => {
    const urls = entries.map((entry) => entry.url);
    expect(urls).toContain(site.url);
    expect(urls).toContain(`${site.url}/services`);
    for (const project of projects) {
      expect(urls).toContain(`${site.url}/projects/${project.slug}`);
    }
  });
});

describe("structured data", () => {
  const home = homeJsonLd("https://adisukma.dev/portrait.png");
  const graph = home["@graph"] as { "@type": string; [key: string]: unknown }[];

  it("publishes a person, a website, and a profile page", () => {
    const types = graph.map((node) => node["@type"]);
    expect(types).toEqual(expect.arrayContaining(["Person", "WebSite", "ProfilePage", "Service"]));
  });

  it("uses only facts this repo already states", () => {
    const person = graph.find((node) => node["@type"] === "Person");
    expect(person?.alternateName).toBe(site.fullName);
    expect(person?.jobTitle).toBe(site.role);
    expect(person?.image).toBe("https://adisukma.dev/portrait.png");
    expect(person?.knowsLanguage).toEqual([...site.languages]);
    expect(person?.sameAs).toEqual([site.linkedin, site.github]);

    const serialized = JSON.stringify(home);
    expect(serialized).not.toMatch(/open to work/i);
    expect(serialized).not.toMatch(/ini vie/i);
    expect(serialized).not.toMatch(/immediately/i);
  });

  it("describes each project as a creative work with a breadcrumb", () => {
    for (const project of projects) {
      const types = projectJsonLd(project)["@graph"].map((node) => node["@type"]);
      expect(types).toEqual(["CreativeWork", "BreadcrumbList"]);
    }
  });

  it("describes the services page", () => {
    const types = servicesJsonLd()["@graph"].map((node) => node["@type"]);
    expect(types).toEqual(expect.arrayContaining(["WebPage", "Service", "FAQPage", "BreadcrumbList"]));
  });
});
