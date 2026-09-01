import Link from "next/link";
import { projects } from "@/content/projects";

export default function AdminProjectsPage() {
  return (
    <main>
      <h1 className="mb-6 font-mono text-lg font-bold text-ink"># projects</h1>
      <ul className="divide-y divide-line border-y border-line">
        {projects.map((project) => (
          <li key={project.slug} className="flex items-baseline justify-between gap-4 py-3">
            <div>
              <p className="font-mono text-sm text-ink">
                {project.index} · {project.title}
              </p>
              <p className="text-xs text-muted">{project.slug}</p>
            </div>
            <Link
              href={`/admin/projects/${project.slug}`}
              className="font-mono text-xs text-accent hover:underline"
            >
              edit
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/admin/projects/new"
        className="mt-6 inline-block rounded border border-line bg-chip px-3 py-1.5 font-mono text-xs text-ink hover:border-accent"
      >
        + new project
      </Link>
    </main>
  );
}
