import { LinesField, TextAreaField, TextField } from "@/components/admin/fields";
import type { Project } from "@/content/projects";

/** Shared between the edit and create forms so the two can never drift. */
export function ProjectFields({ project }: { project: Project }) {
  return (
    <>
      <TextField
        label="slug"
        name="slug"
        defaultValue={project.slug}
        hint="lowercase words separated by hyphens; this is the URL"
        required
      />
      <TextField
        label="index"
        name="index"
        defaultValue={project.index}
        hint="two-digit ordinal shown on the card"
        required
      />
      <TextField label="title" name="title" defaultValue={project.title} required />
      <TextField
        label="type"
        name="type"
        defaultValue={project.type}
        hint="e.g. B2B PLATFORM · FULLSTACK"
        required
      />
      <TextField label="role" name="role" defaultValue={project.role} required />
      <TextAreaField label="summary" name="summary" defaultValue={project.summary} required />
      <TextAreaField label="problem" name="problem" defaultValue={project.problem} required />
      <TextAreaField label="built" name="built" defaultValue={project.built} rows={7} required />
      <LinesField label="highlights" name="highlights" values={project.highlights} required />
      <LinesField label="tech" name="tech" values={project.tech} required />
      <LinesField
        label="featured tech"
        name="featuredTech"
        values={project.featuredTech}
        hint="one per line; the subset shown on the home-page card"
        required
      />
      <TextField
        label="live url"
        name="liveUrl"
        defaultValue={project.liveUrl ?? ""}
        hint="optional; leave empty for client-confidential work"
      />
      <TextField
        label="repo url"
        name="repoUrl"
        defaultValue={project.repoUrl ?? ""}
        hint="optional; leave empty for client-confidential work"
      />
    </>
  );
}
