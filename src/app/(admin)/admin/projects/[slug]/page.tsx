import { notFound } from "next/navigation";
import { ProjectFields } from "@/components/admin/project-fields";
import { SaveForm } from "@/components/admin/save-form";
import { getProject } from "@/content/projects";
import { deleteProject, saveProject } from "@/lib/admin/actions";

export default async function AdminEditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main>
      <h1 className="mb-6 font-mono text-lg font-bold text-ink"># {project.slug}</h1>
      <SaveForm action={saveProject}>
        <input type="hidden" name="originalSlug" value={project.slug} />
        <ProjectFields project={project} />
      </SaveForm>
      <form action={deleteProject} className="mt-10 border-t border-line pt-4">
        <input type="hidden" name="originalSlug" value={project.slug} />
        <button
          type="submit"
          className="rounded border border-line px-3 py-1.5 font-mono text-xs text-muted hover:border-accent hover:text-accent"
        >
          delete this project
        </button>
      </form>
    </main>
  );
}
