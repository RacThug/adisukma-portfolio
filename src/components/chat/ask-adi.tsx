"use client";

import { useChat } from "@ai-sdk/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { Chip } from "@/components/chip";
import {
  ASK_LABEL,
  DISCLOSURE,
  EMPTY_STATE,
  NUDGE,
  SUGGESTIONS,
  UNREACHABLE,
} from "@/lib/chat/copy";
import { MAX_QUESTION_CHARS, textOf } from "@/lib/chat/guards";

import { BotGlyph } from "./bot-glyph";

const NUDGE_SEEN_KEY = "adi:chat:nudge-seen";
const NUDGE_DELAY_MS = 2500;

/** The id of the wrapper around the rest of the page. Made `inert` while the panel is open. */
const SITE_ROOT_ID = "site-root";

const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

export function AskAdi() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [showNudge, setShowNudge] = useState(false);

  // The AI SDK stopped managing input state in v5 and this repo is on v7, so it
  // is ours. `status` is 'submitted' | 'streaming' | 'ready' | 'error'.
  const { messages, sendMessage, status, error } = useChat();

  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const titleId = useId();
  const busy = status === "submitted" || status === "streaming";

  const dismissNudge = useCallback(() => {
    setShowNudge(false);
    try {
      localStorage.setItem(NUDGE_SEEN_KEY, "1");
    } catch {
      // Private browsing. The nudge returns next visit; harmless.
    }
  }, []);

  // Once, ever. A prompt that reappears on every visit is a prompt people learn
  // to swat - and we would have taught them to ignore the one thing that makes a
  // corner launcher discoverable at all.
  useEffect(() => {
    let seen = true;
    try {
      seen = localStorage.getItem(NUDGE_SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;

    const timer = setTimeout(() => setShowNudge(true), NUDGE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  const openPanel = useCallback(() => {
    setOpen(true);
    dismissNudge();
  }, [dismissNudge]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // Focus trap. There is no Radix or shadcn here, so this is ours to write - and
  // a dialog you can Tab out of behind is a real accessibility failure.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      // Focus is outside the panel. This is not exotic: the send button disables
      // itself the moment you submit, and a disabled element drops focus to
      // <body>. Wrapping only at the edges would then let Tab walk the page
      // behind an open dialog for the whole time an answer is streaming.
      if (!(active instanceof Node) || !panel.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // `aria-modal` tells assistive tech the rest of the page is unreachable. That
  // is a promise, and `inert` is what keeps it: without this, the attribute is a
  // lie told to exactly the users who cannot check it.
  useEffect(() => {
    if (!open) return;
    const root = document.getElementById(SITE_ROOT_ID);
    root?.setAttribute("inert", "");
    document.body.classList.add("chat-open");
    return () => {
      root?.removeAttribute("inert");
      document.body.classList.remove("chat-open");
    };
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages]);

  function ask(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    setInput("");
    void sendMessage({ text: question });
  }

  return (
    <>
      <div className="fixed right-4 bottom-4 z-30 flex flex-col items-end gap-3 md:right-6 md:bottom-6">
        {showNudge && !open && (
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
          ref={launcherRef}
          type="button"
          onClick={openPanel}
          aria-expanded={open}
          aria-haspopup="dialog"
          className="flex cursor-pointer items-center gap-2 rounded-sm border border-accent bg-accent px-4 py-2.5 font-mono text-xs font-bold tracking-wide text-accent-ink shadow-lg transition-opacity hover:opacity-90"
        >
          <BotGlyph size={18} />
          {ASK_LABEL}
        </button>
      </div>

      {open && (
        <>
          {/*
            Click-away, and the visual half of the modality: a scrim on mobile,
            where the panel is a sheet that owns the screen; invisible on desktop,
            where it is a card and dimming the page would be theatre.

            Black rather than `bg-bg`, which is what this was first: on a
            near-black theme, a translucent layer of the background colour over
            the background dims nothing at all. A scrim that does not scrim is
            just decoration with a z-index.
          */}
          <div
            onClick={close}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/60 md:bg-transparent"
          />

          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col rounded-t-sm border-t border-line bg-bg shadow-2xl md:inset-x-auto md:right-6 md:bottom-24 md:h-auto md:max-h-[32rem] md:w-96 md:rounded-sm md:border"
          >
            <div className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2.5 font-mono text-xs text-ink">
              <span className="text-accent">
                <BotGlyph size={14} />
              </span>
              <span id={titleId}>{ASK_LABEL}</span>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="ml-auto cursor-pointer font-mono text-sm text-muted transition-colors hover:text-accent"
              >
                ✕
              </button>
            </div>

            <div ref={logRef} className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-3 py-3">
              {/*
                The empty state lives *inside* the scrolling log, chips and all.
                Pinning the chips above the input instead left a canyon of dead
                space on the mobile sheet, where the log is `flex-1` inside a
                fixed height and expands to fill it. Here the blank space falls
                below the chips - which is where the conversation is about to go.
              */}
              {messages.length === 0 && (
                <div className="flex flex-col gap-3">
                  <p className="text-[13px] leading-relaxed text-muted">{EMPTY_STATE}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => ask(suggestion)}
                        className="cursor-pointer rounded-xs transition-opacity hover:opacity-75"
                      >
                        <Chip>
                          <span className="text-accent">▸ </span>
                          {suggestion}
                        </Chip>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => {
                const text = textOf(message);
                return (
                  <div key={message.id}>
                    <span className="mb-0.5 block font-mono text-[9.5px] tracking-[0.1em] text-muted">
                      {message.role === "user" ? "YOU" : <span className="text-accent">BOT</span>}
                    </span>
                    <p
                      className={
                        message.role === "user"
                          ? "font-mono text-[12.5px] leading-relaxed text-ink"
                          : "text-[13px] leading-relaxed whitespace-pre-wrap text-ink"
                      }
                    >
                      {text}
                      {message.role === "assistant" && busy && text.length === 0 && (
                        <span className="inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse bg-accent" />
                      )}
                    </p>
                  </div>
                );
              })}

              {error && <p className="text-[13px] leading-relaxed text-muted">{UNREACHABLE}</p>}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                ask(input);
              }}
              // The bottom inset keeps the disclosure clear of a phone's home
              // indicator, which would otherwise sit right on top of it.
              className="border-t border-line px-3 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            >
              <div className="flex items-center gap-2 rounded-xs border border-line bg-surface px-2.5 py-2 focus-within:border-accent">
                <span aria-hidden className="font-mono text-[13px] text-accent">
                  ~
                </span>
                {/*
                  Deliberately not disabled while an answer streams. Disabling the
                  focused input hands focus back to <body>, which drops the user
                  out of the dialog mid-answer and costs a screen-reader user
                  their place entirely. `ask` ignores submits while busy instead,
                  and you get to type your next question while this one lands.
                */}
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  maxLength={MAX_QUESTION_CHARS}
                  placeholder={ASK_LABEL}
                  aria-label="Ask about Adi"
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent font-mono text-[13px] text-ink outline-none placeholder:text-muted"
                />
                <button
                  type="submit"
                  disabled={busy || input.trim().length === 0}
                  aria-label="Send"
                  className="cursor-pointer rounded-xs border border-line px-2 py-1 font-mono text-xs text-muted transition-colors not-disabled:hover:border-accent not-disabled:hover:text-accent disabled:cursor-default disabled:opacity-40"
                >
                  →
                </button>
              </div>
              <p className="mt-2 font-mono text-[9.5px] tracking-wide text-muted opacity-85">
                {DISCLOSURE}
              </p>
            </form>
          </div>
        </>
      )}
    </>
  );
}
