import { clientFaq } from "@/content/hiring";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { topSkills } from "@/content/skills";

/**
 * `/llms.txt`, generated from the same modules the pages render.
 * A hand-written file would be a second account of Adi, which is how the last
 * one rotted. See docs/adr/0001.
 */
export function buildLlmsTxt(): string {
  const projectsBlock = projects.map((project) => {
    const live = project.liveUrl ? ` Live: ${project.liveUrl}.` : "";
    const source = project.repoUrl ? ` Source: ${project.repoUrl}.` : "";
    return `- [${project.title}](${site.url}/projects/${project.slug}): ${project.seoDescription}${live}${source}`;
  });

  const faqBlock = clientFaq.map((entry) => `- ${entry.question} ${entry.answer}`);

  return [
    `# ${site.name} (${site.fullName})`,
    "",
    `> ${site.role} based in ${site.location} (UTC+8). ${site.availability}. Languages: ${site.languages.join(", ")}. Builds production websites and web apps with ${topSkills.join(", ")}, plus PHP and Symfony.`,
    "",
    "## Contact",
    "",
    `- Email: ${site.email}`,
    `- LinkedIn: ${site.linkedin}`,
    `- GitHub: ${site.github}`,
    `- Website: ${site.url}`,
    `- CV (PDF): ${site.url}${site.cvPath}`,
    "",
    "## Pages",
    "",
    `- [Home](${site.url}/): profile, skills, selected work, experience, client FAQ, and contact`,
    `- [Freelance services](${site.url}/services): what he builds, where he works, and how to start a project`,
    ...projectsBlock,
    "",
    "## Freelance",
    "",
    `${site.availability}.`,
    "He works remotely anywhere, and on-site or hybrid around Bali. He is not looking to relocate.",
    "Rates, timelines, and a start date are not published on this site.",
    "",
    "## Client FAQ",
    "",
    ...faqBlock,
    "",
  ].join("\n");
}
