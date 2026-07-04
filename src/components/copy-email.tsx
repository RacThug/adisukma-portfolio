"use client";

import { useState } from "react";
import { site } from "@/content/site";

export function CopyEmail() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable; the mailto link next to this still works
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-sm border border-line px-4 py-2.5 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent cursor-pointer"
    >
      {copied ? "copied ✓" : "copy email"}
    </button>
  );
}
