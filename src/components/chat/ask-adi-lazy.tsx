"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

import { ASK_LABEL, NUDGE, NUDGE_DELAY_MS, NUDGE_SEEN_KEY } from "@/lib/chat/copy";

import { BotGlyph } from "./bot-glyph";

/**
 * The launcher is part of the first load. The panel, and the AI SDK it pulls
 * in, download the first time someone opens the chat.
 */
const AskAdi = dynamic(() => import("./ask-adi").then((m) => m.AskAdi), {
  ssr: false,
  loading: () => <ChatLauncher pending />,
});

export function AskAdiLazy() {
  const [start, setStart] = useState(false);

  if (start) return <AskAdi initialOpen />;
  return <ChatLauncher onOpen={() => setStart(true)} />;
}

function ChatLauncher({
  onOpen,
  pending = false,
}: {
  onOpen?: () => void;
  pending?: boolean;
}) {
  const [showNudge, setShowNudge] = useState(false);

  const dismissNudge = useCallback(() => {
    setShowNudge(false);
    try {
      localStorage.setItem(NUDGE_SEEN_KEY, "1");
    } catch {
      // Private browsing. The nudge returns next visit; harmless.
    }
  }, []);

  useEffect(() => {
    if (pending || !onOpen) return;
    let seen = true;
    try {
      seen = localStorage.getItem(NUDGE_SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;

    const timer = setTimeout(() => setShowNudge(true), NUDGE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [onOpen, pending]);

  return (
    <div className="fixed right-4 bottom-4 z-30 flex flex-col items-end gap-3 md:right-6 md:bottom-6">
      {showNudge && (
        <div className="relative max-w-60 rounded-r-sm border border-l-2 border-line border-l-accent bg-surface px-3 py-2.5 pr-7 text-[13px] leading-snug text-ink shadow-lg">
          <button
            type="button"
            onClick={dismissNudge}
            aria-label="Dismiss"
            className="absolute top-1 right-1.5 cursor-pointer font-mono text-[11px] text-muted transition-colors hover:text-accent"
          >
            ✕
          </button>
          {NUDGE}
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          dismissNudge();
          onOpen?.();
        }}
        aria-expanded={false}
        aria-haspopup="dialog"
        aria-busy={pending || undefined}
        className="flex cursor-pointer items-center gap-2 rounded-sm border border-accent bg-accent px-4 py-2.5 font-mono text-xs font-bold tracking-wide text-accent-ink shadow-lg transition-opacity hover:opacity-90"
      >
        <BotGlyph size={18} />
        {ASK_LABEL}
      </button>
    </div>
  );
}
