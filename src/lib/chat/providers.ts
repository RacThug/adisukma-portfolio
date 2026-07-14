import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { APICallError, type LanguageModel } from "ai";

/**
 * A provider is three strings. That is the whole abstraction (docs/adr/0002).
 *
 * It works because both providers we care about speak the OpenAI wire format:
 * OpenRouter natively, and Gemini through Google's OpenAI-compatible endpoint.
 * So swapping the model - or the company behind it - is an environment edit,
 * not a code change. Nothing else in this feature knows which model it is
 * talking to.
 */
export interface ProviderConfig {
  name: string;
  baseURL: string;
  apiKey: string;
  model: string;
}

const SLOTS = [
  { name: "primary", prefix: "CHAT_PRIMARY" },
  { name: "fallback", prefix: "CHAT_FALLBACK" },
] as const;

/**
 * The provider chain, in the order we try it. A slot with any of its three
 * variables missing is simply absent - a half-configured fallback is not a
 * fallback, and failing quietly to zero providers is better than failing loudly
 * to a broken one.
 */
export function readProviders(env: Record<string, string | undefined> = process.env): ProviderConfig[] {
  return SLOTS.flatMap(({ name, prefix }) => {
    const baseURL = env[`${prefix}_BASE_URL`];
    const apiKey = env[`${prefix}_API_KEY`];
    const model = env[`${prefix}_MODEL`];
    return baseURL && apiKey && model ? [{ name, baseURL, apiKey, model }] : [];
  });
}

export function modelFor(config: ProviderConfig): LanguageModel {
  return createOpenAICompatible({
    name: config.name,
    baseURL: config.baseURL,
    apiKey: config.apiKey,
  })(config.model);
}

/**
 * Is this worth trying on the next provider?
 *
 * Yes for the things a different company might not be suffering: rate limits,
 * server errors, network failures, timeouts. No for a bad request - a malformed
 * call will be just as malformed at the next provider, and retrying it only
 * burns a second quota to fail a second time.
 *
 * Anything we do not recognise is treated as *ours* - a bug in this code, not a
 * provider outage - and is not retried. Better to surface a Handoff than to
 * quietly drain both accounts because of a typo.
 */
export function isRetryable(error: unknown): boolean {
  if (APICallError.isInstance(error)) {
    const status = error.statusCode;
    if (status === undefined) return true; // never reached the server
    return status === 408 || status === 429 || status >= 500;
  }

  if (error instanceof Error) {
    // Fetch failures and aborts surface as plain Errors, not APICallErrors.
    if (error.name === "AbortError" || error.name === "TimeoutError") return true;
    if (error instanceof TypeError) return true; // `fetch failed`
  }

  return false;
}
