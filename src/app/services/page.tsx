import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Nav } from "@/components/nav";
import { FaqList } from "@/components/sections/hiring";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { waysOfWorking } from "@/content/skills";
import { servicesJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Freelance Web Development in Bali",
  description: site.servicesDescription,
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Freelance Web Development in Bali",
    description: site.servicesDescription,
    url: "/services",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Freelance Web Development in Bali",
    description: site.servicesDescription,
  },
};

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.16em] text-muted">
        <span className="text-accent">##</span> {label}
      </h2>
      {children}
    </section>
  );
}

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={servicesJsonLd()} />
      <Nav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <Link
          href="/"
          className="font-mono text-xs text-muted transition-colors hover:text-accent"
        >
          ← cd ~
        </Link>

        <header className="mt-8">
          <p className="font-mono text-[11px] tracking-[0.08em] text-accent">
            FREELANCE · REMOTE OR BALI
          </p>
          <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Freelance web development
          </h1>
          <p className="mt-3 font-mono text-xs text-muted">
            {site.role} · {site.location}
          </p>
        </header>

        <div className="mt-8 space-y-5 leading-relaxed text-ink/90">
          <p>{site.intro}</p>
          <p>
            {site.availability}. Based in Denpasar, on UTC+8, and not looking to relocate, so a
            project elsewhere is remote. Languages: {site.languages.join(" and ")}.
          </p>
        </div>

        <p className="mt-6 font-mono text-xs leading-relaxed text-muted">
          <span className="text-accent"># ways of working:</span> {waysOfWorking.join(" · ")}
        </p>

        <Block label="selected work">
          <ul className="space-y-4">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="font-mono text-sm font-bold text-ink transition-colors hover:text-accent"
                >
                  {project.title}
                </Link>
                <p className="mt-1 text-sm leading-relaxed text-muted">{project.seoDescription}</p>
              </li>
            ))}
          </ul>
        </Block>

        <Block label="questions">
          <FaqList />
        </Block>

        <div className="mt-16 rounded-md border border-line bg-surface/70 p-6">
          <p className="font-mono text-xs text-muted">
            <a
              href={`mailto:${site.email}`}
              className="text-accent hover:underline underline-offset-4"
            >
              {site.email}
            </a>
            {" · "}
            <Link href="/#contact" className="text-accent hover:underline underline-offset-4">
              contact →
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
