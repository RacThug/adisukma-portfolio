import type { Project } from "@/content/projects";

export function ProjectWorkflow({ project }: { project: Project }) {
  return (
    <figure className="mt-10 rounded-md border border-line bg-surface/70 p-5 md:p-7">
      <figcaption className="mb-6 font-mono text-xs text-muted">
        <span className="text-accent">How it works</span> · simplified product flow
      </figcaption>
      <ol className="grid gap-6 md:grid-cols-3 md:gap-8">
        {project.workflow.map((step, index) => (
          <li key={step.title} className="relative min-w-0">
            <div className="mb-3 flex items-center gap-3" aria-hidden="true">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-accent/50 bg-chip font-mono text-xs text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              {index < project.workflow.length - 1 && (
                <span className="hidden flex-1 items-center text-accent/60 md:flex">
                  <span className="h-px flex-1 bg-accent/30" />→
                </span>
              )}
            </div>
            <h2 className="font-mono text-sm font-bold text-ink">{step.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
          </li>
        ))}
      </ol>
    </figure>
  );
}
