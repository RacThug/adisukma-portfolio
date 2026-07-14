import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
} from "ai";
import { after } from "next/server";

import { HANDOFF, OUT_OF_BUDGET, TOO_LONG, TOO_MANY_MESSAGES, UNREACHABLE } from "@/lib/chat/copy";
import { guardConversation, textOf } from "@/lib/chat/guards";
import { buildSystemPrompt } from "@/lib/chat/prompt";
import { isRetryable, modelFor, readProviders } from "@/lib/chat/providers";
import { logQuestion, withinBudget } from "@/lib/chat/store";

/** Long enough for a slow free-tier model, short enough to give up on a dead one. */
export const maxDuration = 30;

/** Answers are two or three sentences. A cap this low is a cost guard, not a constraint. */
const MAX_OUTPUT_TOKENS = 400;

/**
 * Say one fixed thing, in the same wire format as a real answer.
 *
 * Every failure in this route goes through here (docs/adr/0003). The Visitor
 * never sees a status code, a stack trace, or a spinner that stops: they see the
 * bot saying something sensible. A recruiter who meets a polished Handoff thinks
 * "considered". One who meets `429 Too Many Requests` thinks "broken" - and they
 * are the exact person this feature exists to impress.
 */
function say(text: string): Response {
  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      execute: ({ writer }) => {
        const id = "handoff";
        writer.write({ type: "text-start", id });
        writer.write({ type: "text-delta", id, delta: text });
        writer.write({ type: "text-end", id });
      },
    }),
  });
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return say(HANDOFF);
  }

  const guard = guardConversation(body);
  if (!guard.ok) {
    switch (guard.reason) {
      case "question-too-long":
        return say(TOO_LONG);
      case "too-many-messages":
        return say(TOO_MANY_MESSAGES);
      // `conversation-too-large` means a forged transcript, not a real thread.
      // It gets the Handoff, not advice about trimming a question they never
      // asked - the mistake that shipped last time was telling a Visitor their
      // input was the problem when it was ours.
      default:
        return say(HANDOFF);
    }
  }

  if (!(await withinBudget())) {
    return say(OUT_OF_BUDGET);
  }

  const providers = readProviders();
  if (providers.length === 0) {
    // Misconfigured, not broken. The Visitor still gets an email address.
    return say(HANDOFF);
  }

  // `guardConversation` returns text-only messages, so this cannot throw on a
  // malformed part. The try/catch is here anyway: this call sits between the
  // Visitor and the one promise this route makes, and a future SDK could find a
  // new way to reject a body we thought was clean.
  let messages;
  try {
    messages = await convertToModelMessages(guard.messages);
  } catch {
    return say(HANDOFF);
  }

  const question = textOf(guard.messages[guard.messages.length - 1]);
  // `after` runs this once the response is finished, so the Question Log never
  // sits between a Visitor and their answer. Next 16 ships it for exactly this.
  after(() => logQuestion(question));

  const instructions = buildSystemPrompt();

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const id = "answer";
      let started = false;

      const emit = (delta: string) => {
        if (!started) {
          writer.write({ type: "text-start", id });
          started = true;
        }
        writer.write({ type: "text-delta", id, delta });
      };

      for (const provider of providers) {
        try {
          // `streamText` is lazy: the request does not leave until the stream is
          // consumed, so a provider's failure surfaces *here*, in the loop, not
          // at the call above. That is precisely why we own the stream rather
          // than handing `result` straight to a response helper - a plain
          // try/catch around `streamText` would never fire.
          const result = streamText({
            model: modelFor(provider),
            instructions,
            messages,
            maxOutputTokens: MAX_OUTPUT_TOKENS,
            maxRetries: 0, // Retrying inside a dead provider just delays the next one.
          });

          for await (const delta of result.textStream) {
            emit(delta);
          }

          if (started) {
            writer.write({ type: "text-end", id });
            return;
          }
          // Silence is a failure, not an answer. Fall through to the next provider.
        } catch (error) {
          if (started) {
            // Mid-sentence. There is no clean way to restart on another provider
            // without the Visitor watching the answer rewrite itself, so we
            // finish honestly instead.
            emit(`\n\n${HANDOFF}`);
            writer.write({ type: "text-end", id });
            return;
          }

          // A 4xx will be just as wrong at the next provider. Only an outage, a
          // rate limit, or a network failure is worth someone else's quota.
          if (!isRetryable(error)) break;
        }
      }

      emit(HANDOFF);
      writer.write({ type: "text-end", id });
    },

    // The backstop, for a throw that escapes `execute` itself. Note this does
    // *not* become assistant text - `createUIMessageStream` emits an error part,
    // which the widget renders as UNREACHABLE. Same contract, different words:
    // still a 200, still an email, still never a status code.
    onError: () => UNREACHABLE,
  });

  return createUIMessageStreamResponse({ stream });
}
