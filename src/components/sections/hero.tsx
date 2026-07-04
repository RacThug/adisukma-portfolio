import Link from "next/link";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-24 pb-28 md:pt-36">
      <p className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-line px-4 py-1.5 font-mono text-[11px] tracking-[0.06em] text-accent">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
          <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
        </span>
        OPEN_TO_WORK: remote · hybrid · on-site
      </p>

      <h1 className="font-mono text-4xl font-bold tracking-tight text-ink md:text-6xl">
        <span className="text-accent">$ </span>
        {site.name}
      </h1>

      <p className="mt-3 font-mono text-sm text-muted md:text-base">
        <span aria-hidden>{"// "}</span>
        {site.role} · {site.location}
      </p>

      <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink md:text-xl">
        {site.tagline.pre}
        <span className="text-accent">{site.tagline.highlight}</span>
        {site.tagline.post}
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Link
          href="/#projects"
          className="rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-opacity hover:opacity-90"
        >
          View projects
        </Link>
        <Link
          href="/#contact"
          className="rounded-sm border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Get in touch
        </Link>
        <a
          href={site.cvPath}
          download
          className="font-mono text-xs text-muted underline underline-offset-4 transition-colors hover:text-accent"
        >
          download_cv.pdf
        </a>
      </div>
    </section>
  );
}
