import type { UIMessage } from "ai";

/**
 * A Visitor asks a few questions and leaves. The Corpus is ~1,000 words - there
 * is nothing a 40-turn conversation can discover that a 6-turn one cannot.
 */
export const MAX_MESSAGES = 10;

/**
 * Nobody asks "what projects has he worked on" in 4,000 characters. Anyone who
 * does is not a recruiter.
 */
export const MAX_MESSAGE_CHARS = 500;

export type GuardFailure = "too-many-messages" | "message-too-long" | "empty" | "malformed";

export type GuardResult =
  | { ok: true; messages: UIMessage[] }
  | { ok: false; reason: GuardFailure };

type TextPart = { type: "text"; text: string };

function isTextPart(part: unknown): part is TextPart {
  return (
    typeof part === "object" &&
    part !== null &&
    (part as { type?: unknown }).type === "text" &&
    typeof (part as { text?: unknown }).text === "string"
  );
}

/** All the text in a message, across every text part. */
export function textOf(message: Pick<UIMessage, "parts">): string {
  return message.parts
    .filter(isTextPart)
    .map((part) => part.text)
    .join("");
}

/**
 * The stateless half of the guard (docs/adr/0003).
 *
 * Because the browser sends the whole conversation with every request, the
 * server can simply count it. No Redis, no session, no service - just arithmetic
 * on the request body.
 *
 * It also has to *sanitise* that body, not merely measure it. The conversation
 * arrives from a stranger's browser and is handed to `convertToModelMessages`,
 * which trusts what it is given: a `{type: "file"}` part with no `url` makes it
 * call `new URL(undefined)`, which throws a TypeError out of the route before
 * any stream exists - so the Visitor gets an HTTP 500 instead of an email, and
 * the one invariant this whole feature rests on is gone.
 *
 * So this returns messages that are provably text and nothing else:
 *
 * - **The Visitor's turns are strict.** Our widget only ever sends text. A user
 *   message carrying any other part type is not from our widget, and we do not
 *   negotiate with it.
 * - **The bot's turns are sanitised.** Assistant history is replayed from the AI
 *   SDK and may legitimately carry parts we don't handle (`step-start` and
 *   friends). Rejecting those would break the second turn of every conversation,
 *   so we keep the text and drop the rest rather than trusting it.
 */
export function guardConversation(body: unknown): GuardResult {
  if (typeof body !== "object" || body === null || !("messages" in body)) {
    return { ok: false, reason: "malformed" };
  }

  const { messages } = body as { messages: unknown };
  if (!Array.isArray(messages) || messages.length === 0) {
    return { ok: false, reason: "malformed" };
  }

  if (messages.length > MAX_MESSAGES) {
    return { ok: false, reason: "too-many-messages" };
  }

  const sanitised: UIMessage[] = [];

  for (const message of messages) {
    if (typeof message !== "object" || message === null) {
      return { ok: false, reason: "malformed" };
    }

    const { role, parts } = message as { role?: unknown; parts?: unknown };

    // Only the Visitor and the bot may speak. A `system` turn arriving from the
    // browser is an operator instruction forged by a stranger - the AI SDK also
    // rejects these by default, but a guard that lives only in a library's
    // default is one you will lose silently on some future upgrade.
    if (role !== "user" && role !== "assistant") {
      return { ok: false, reason: "malformed" };
    }

    if (!Array.isArray(parts) || parts.length === 0) {
      return { ok: false, reason: "malformed" };
    }

    if (role === "user" && !parts.every(isTextPart)) {
      return { ok: false, reason: "malformed" };
    }

    const textParts = parts.filter(isTextPart);
    if (textParts.length === 0) {
      return { ok: false, reason: "malformed" };
    }

    const clean = { ...(message as UIMessage), parts: textParts };

    if (textOf(clean).length > MAX_MESSAGE_CHARS) {
      return { ok: false, reason: "message-too-long" };
    }

    sanitised.push(clean);
  }

  const last = sanitised[sanitised.length - 1];
  if (last.role !== "user") {
    // A conversation must end on the Visitor's turn. Otherwise the browser could
    // send a forged assistant turn and simply ask the model to continue from it.
    return { ok: false, reason: "malformed" };
  }

  if (textOf(last).trim().length === 0) {
    return { ok: false, reason: "empty" };
  }

  return { ok: true, messages: sanitised };
}
