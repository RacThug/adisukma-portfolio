import Link from "next/link";
import { experience } from "@/content/experience";
import { featuredRepos } from "@/content/github";
import { hiringFaq } from "@/content/hiring";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";

export default function AdminIndexPage() {
  const sections = [
    { href: "/admin/site", label: "site", note: "identity, bio, contact, tagline" },
    { href: "/admin/projects", label: "projects", note: `${projects.length} written up` },
    { href: "/admin/experience", label: "experience", note: `${experience.length} entries + education` },
    { href: "/admin/skills", label: "skills", note: `${skillGroups.length} groups` },
    { href: "/admin/hiring", label: "hiring faq", note: `${hiringFaq.length} answers` },
    { href: "/admin/github", label: "github", note: `${featuredRepos.length} allowlisted repos` },
  ];

  return (
    <main>
      <ul className="divide-y divide-line border-y border-line">
        {sections.map((section) => (
          <li key={section.href}>
            <Link
              href={section.href}
              className="flex items-baseline justify-between gap-4 py-3 hover:text-accent"
            >
              <span className="font-mono text-sm font-bold">{section.label}</span>
              <span className="text-xs text-muted">{section.note}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
