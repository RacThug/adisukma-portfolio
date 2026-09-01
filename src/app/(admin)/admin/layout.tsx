import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminEnabled } from "@/lib/admin/enabled";

export const metadata: Metadata = {
  title: "content admin",
  robots: { index: false, follow: false },
};

const sections = [
  { href: "/admin/site", label: "site" },
  { href: "/admin/projects", label: "projects" },
  { href: "/admin/experience", label: "experience" },
  { href: "/admin/skills", label: "skills" },
  { href: "/admin/hiring", label: "hiring" },
  { href: "/admin/github", label: "github" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Dev-only, enforced here for every page and again inside every action:
  // a production build prerenders all of /admin as a 404.
  if (!adminEnabled()) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <header className="mb-8 border-b border-line pb-4">
        <p className="font-mono text-sm font-bold text-accent">
          <Link href="/admin">~/content-admin</Link>
        </p>
        <p className="mt-1 text-sm text-muted">
          Dev-only. Saving writes <code className="font-mono">src/content/*.json</code>; nothing is
          published until you commit. Review with <code className="font-mono">git diff</code>.
        </p>
        <nav className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded border border-line bg-chip px-2 py-1 text-ink hover:border-accent"
            >
              {section.label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
    </div>
  );
}
