import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";

const links = [
  { href: "/#projects", label: "projects" },
  { href: "/#about", label: "about" },
  { href: "/#experience", label: "experience" },
  { href: "/#hiring", label: "hiring" },
  { href: "/#contact", label: "contact" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-mono text-sm font-bold text-ink hover:text-accent transition-colors">
          adi@sukma:~
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-3 sm:gap-7">
          <ul className="hidden sm:flex items-center gap-6 font-mono text-xs text-muted">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-accent transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
          <MobileNav links={links} />
        </nav>
      </div>
    </header>
  );
}
