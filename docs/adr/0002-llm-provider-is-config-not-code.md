# The LLM provider is configuration, not code

The chatbot talks to its model through a single OpenAI-compatible client, configured by three environment
variables: base URL, API key, model name. Swapping the provider is an env edit, not a code change.

**Why this works.** Both providers we care about speak the OpenAI wire format. OpenRouter is natively
OpenAI-compatible, and Google ships an OpenAI-compatible endpoint for Gemini at
`https://generativelanguage.googleapis.com/v1beta/openai/`. So a "provider" collapses to those three strings,
and the AI SDK's `openai-compatible` provider consumes them directly.

**Decided:** Gemini Flash-Lite on the free tier is primary (the highest free ceiling of the options, at 15
requests/minute and 1,000/day, and a small fast model is the right shape for extractive Q&A over a
1,000-word corpus). OpenRouter is the fallback. The chain is a list, tried in order.

**Fall through only on retryable errors** - 5xx, network failures, timeouts, and 429. Never on a 4xx: a
malformed request will be malformed at every provider, and retrying it merely burns three quotas to fail
three times.

**What the fallback actually buys, honestly.** It rescues a provider *outage*. It barely touches a provider
*quota*: OpenRouter's free tier is 50 requests/day against Gemini's 1,000, so falling through adds about 5%
headroom, and if the 1,000 were burned by abuse the abuser eats the 50 too. The fallback is the seatbelt.
The rate limiter (ADR 0003) is the brakes. Do not mistake one for the other.

**Known costs.** Google's OpenAI-compatibility layer is officially beta and *silently ignores* parameters it
does not recognise, so a setting that appears to do nothing is probably being dropped. Free-tier quotas are
not a contract - Google cut them 50-80% in December 2025 with no notice - so a feature depending on that
number will eventually break on a Tuesday. The upgrade path is a paid key, and at realistic portfolio traffic
that is a couple of dollars a month.

**Consequence.** The corpus builder, the system prompt, the refusal rules, and the guards know nothing about
which model is behind them. That is deliberate: the valuable part of this feature is portable, and the
replaceable part is three strings.
