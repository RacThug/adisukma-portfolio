import { ProjectFields } from "@/components/admin/project-fields";
import { SaveForm } from "@/components/admin/save-form";
import { projects } from "@/content/projects";
import { createProject } from "@/lib/admin/actions";
import type { Project } from "@/content/projects";

export default function AdminNewProjectPage() {
  const empty: Project = {
    slug: "",
    index: String(projects.length + 1).padStart(2, "0"),
    title: "",
    type: "",
    role: "",
    summary: "",
    problem: "",
    built: "",
    highlights: [],
    tech: [],
    featuredTech: [],
  };

  return (
    <main>
      <h1 className="mb-6 font-mono text-lg font-bold text-ink"># new project</h1>
      <SaveForm action={createProject}>
        <ProjectFields project={empty} />
      </SaveForm>
    </main>
  );
}
