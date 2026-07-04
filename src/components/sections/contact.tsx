import { CopyEmail } from "@/components/copy-email";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/content/site";

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20 pb-28">
      <SectionHeading path="contact" note="say hello" />
      <h2 className="max-w-2xl font-mono text-3xl font-bold tracking-tight text-ink md:text-4xl">
        Have a role or a project in mind?
        <span className="text-accent"> Let’s talk.</span>
      </h2>
      <p className="mt-5 max-w-xl leading-relaxed text-muted">
        Open to frontend, backend, and fullstack roles, on-site, hybrid, or remote. The fastest
        way to reach me is email or LinkedIn.
      </p>
      <div className="mt-9 flex flex-wrap items-center gap-4">
        <a
          href={`mailto:${site.email}`}
          className="rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-opacity hover:opacity-90"
        >
          {site.email}
        </a>
        <CopyEmail />
        <a
          href={site.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm border border-line px-5 py-2.5 font-mono text-xs text-ink transition-colors hover:border-accent hover:text-accent"
        >
          linkedin →
        </a>
      </div>
    </section>
  );
}
