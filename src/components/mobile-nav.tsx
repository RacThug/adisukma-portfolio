"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export function MobileNav({ links }: { links: readonly { href: string; label: string }[] }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function closeOutside(event: PointerEvent) {
      const details = detailsRef.current;
      if (event.target instanceof Node && !details?.contains(event.target) && details) {
        details.open = false;
      }
    }
    const desktop = window.matchMedia("(min-width: 640px)");
    function closeOnDesktop() {
      if (desktop.matches && detailsRef.current) detailsRef.current.open = false;
    }
    document.addEventListener("pointerdown", closeOutside);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, []);

  return (
    <details
      ref={detailsRef}
      className="group sm:hidden"
      onKeyDown={(event) => {
        if (event.key === "Escape" && detailsRef.current?.open) {
          event.preventDefault();
          detailsRef.current.open = false;
          summaryRef.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
      }}
    >
      <summary
        ref={summaryRef}
        className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-sm border border-line px-3 font-mono text-xs text-ink hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent [&::-webkit-details-marker]:hidden"
      >
        Menu <span aria-hidden className="text-accent group-open:rotate-180">⌄</span>
      </summary>
      <ul className="absolute inset-x-0 top-full border-b border-line bg-bg px-6 py-3 shadow-lg">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={() => { if (detailsRef.current) detailsRef.current.open = false; }}
              className="flex min-h-11 items-center rounded-sm px-3 font-mono text-sm text-ink hover:bg-surface hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
