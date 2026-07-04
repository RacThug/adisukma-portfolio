"use client";

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // storage unavailable (private mode) — theme still applies for this page
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className="font-mono text-xs border border-line rounded-xs px-3 py-1.5 text-muted hover:text-ink hover:border-muted transition-colors cursor-pointer"
    >
      {/* both labels always rendered; the active theme's CSS shows the right one */}
      <span className="hidden dark:inline">theme --light</span>
      <span className="inline dark:hidden">theme --dark</span>
    </button>
  );
}
