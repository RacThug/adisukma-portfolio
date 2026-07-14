import { site } from "@/content/site";
import { PRIVACY_NOTE } from "@/lib/chat/copy";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-8 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name} · {site.location}
        </p>
        <p>built with Next.js 16 + Tailwind CSS 4</p>
      </div>
      <div className="mx-auto max-w-5xl px-6 pb-8 font-mono text-[11px] leading-relaxed text-muted opacity-70">
        <p>{PRIVACY_NOTE}</p>
      </div>
    </footer>
  );
}
