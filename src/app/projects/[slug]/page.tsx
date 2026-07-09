import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Chip } from "@/components/chip";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { getProject, projects } from "@/content/projects";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `/projects/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
    },
  };
}

function CaseSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.16em] text-muted">
        <span className="text-accent">##</span> {label}
      </h2>
      {children}
    </section>
  );
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <Link
          href="/#projects"
          className="font-mono text-xs text-muted transition-colors hover:text-accent"
        >
          ← cd ../projects
        </Link>

        <header className="mt-8">
          <p className="font-mono text-[11px] tracking-[0.08em] text-accent">{project.type}</p>
          <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight text-ink md:text-4xl">
            {project.title}
          </h1>
          <p className="mt-3 font-mono text-xs text-muted">
            role: <span className="text-ink">{project.role}</span>
          </p>
        </header>

        <CaseSection label="problem">
          <p className="leading-relaxed text-ink/90">{project.problem}</p>
        </CaseSection>

        <CaseSection label="what I built">
          <p className="leading-relaxed text-ink/90">{project.built}</p>
        </CaseSection>

        <CaseSection label="highlights">
          <ul className="space-y-2.5">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-2.5 text-ink/90">
                <span aria-hidden className="font-mono text-accent">
                  »
                </span>
                {highlight}
              </li>
            ))}
          </ul>
        </CaseSection>

        <CaseSection label="tech stack">
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((tech) => (
              <Chip key={tech}>{tech}</Chip>
            ))}
          </div>
        </CaseSection>

        <div className="mt-16 rounded-md border border-line bg-surface/70 p-6">
          <p className="font-mono text-xs text-muted">
            Interested in the details?{" "}
            <Link href="/#contact" className="text-accent hover:underline underline-offset-4">
              Get in touch →
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
