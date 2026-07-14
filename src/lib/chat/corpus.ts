import { education, experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { skillGroups, topSkills, waysOfWorking } from "@/content/skills";

/**
 * The Corpus: the complete set of facts the chatbot is allowed to state.
 *
 * It is a projection of `src/content`, which is what the pages themselves
 * render. That is the whole point: a project added to `projects.ts` reaches
 * the page and the bot in the same commit, so the bot cannot drift from the
 * site. There is no second, separately maintained account of Adi - the last
 * one rotted for months and had to be deleted. See docs/adr/0001.
 *
 * Facts live here. Behaviour lives in `prompt.ts`. Never mix them.
 */
export function buildCorpus(): string {
  return [
    identity(),
    bio(),
    skills(),
    projectSection(),
    experienceSection(),
    educationSection(),
  ].join("\n\n");
}

function identity(): string {
  return [
    "## Who he is",
    "",
    `- Name: ${site.name}`,
    `- Role: ${site.role}`,
    `- Location: ${site.location}`,
    `- Availability: ${site.availability}`,
    `- Email: ${site.email}`,
    `- GitHub: ${site.github}`,
    `- LinkedIn: ${site.linkedin}`,
    `- Website: ${site.url}`,
    `- CV: downloadable from the site at ${site.cvPath}`,
  ].join("\n");
}

function bio(): string {
  return ["## About him", "", ...site.longBio.map((p) => `${p}\n`)].join("\n").trimEnd();
}

function skills(): string {
  const groups = skillGroups.map((g) => `- ${g.label}: ${g.items.join(", ")}`);
  return [
    "## Skills",
    "",
    `Headline skills: ${topSkills.join(", ")}.`,
    "",
    ...groups,
    "",
    "How he works:",
    ...waysOfWorking.map((w) => `- ${w}`),
  ].join("\n");
}

function projectSection(): string {
  // `###` is reserved for project headings. A test asserts the corpus contains
  // exactly as many `###` headings as there are projects, so that a project
  // silently vanishing (or a phantom one appearing) fails loudly.
  const entries = projects.map((p) =>
    [
      `### ${p.title}`,
      `- Type: ${p.type}`,
      `- His role: ${p.role}`,
      `- Summary: ${p.summary}`,
      `- The problem: ${p.problem}`,
      `- What he built: ${p.built}`,
      `- Highlights: ${p.highlights.join("; ")}`,
      `- Tech: ${p.tech.join(", ")}`,
    ].join("\n"),
  );

  return [
    "## Projects",
    "",
    `He has ${projects.length} projects written up on this site. These are the only projects you know about.`,
    "",
    entries.join("\n\n"),
  ].join("\n");
}

function experienceSection(): string {
  const entries = experience.map((e) =>
    [
      `- ${e.title} at ${e.company} (${e.period})`,
      `  ${e.meta}`,
      `  ${e.description}`,
      e.stack ? `  Stack: ${e.stack}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return ["## Experience", "", entries.join("\n\n")].join("\n");
}

function educationSection(): string {
  return ["## Education", "", `- ${education.degree}, ${education.school}`].join("\n");
}
