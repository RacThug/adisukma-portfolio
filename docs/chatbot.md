# The chatbot: running it, guarding it, changing it

The design decisions and *why* they were made live in `docs/adr/0001` through `0004`, and the language
lives in `CONTEXT.md`. Read those first: this file is only the operational half.

## Shape

```
src/lib/chat/
  corpus.ts     the facts, projected from src/content - never edited by hand
  prompt.ts     the behaviour: the Spokesperson Rule, in the words the model reads
  copy.ts       everything the bot and the widget say. Imports nothing but `site`
  guards.ts     stateless caps on a conversation the browser could have forged
  providers.ts  a provider is three strings; retryable vs not
  store.ts      the circuit-breaker and the Question Log. Both fail open
src/app/api/chat/route.ts   the only server code
src/components/chat/        the launcher and panel
```

`copy.ts` importing nothing but `site` is load-bearing, not tidiness. The client bundle needs the
Handoff text. If it reached for it through `prompt.ts` it would drag the whole Corpus and system
prompt into the browser - shipping the bot's instructions to anyone who opens devtools.

## Running it locally

```sh
cp .env.example .env.local     # then paste a Gemini key from aistudio.google.com/apikey
pnpm dev
```

Upstash is optional. Without it the bot works, the circuit-breaker fails open, and nothing is
logged.

## Changing the model or the provider

Edit `.env.local`. That is the entire procedure - `CHAT_PRIMARY_BASE_URL`, `_API_KEY`, `_MODEL`.
Nothing in the corpus, the prompt, the guards, or the UI knows which model is behind them, and both
Gemini and OpenRouter speak the OpenAI wire format, so one client serves either.

**Then run `pnpm eval`.** A new model is a new bot; the only way to know it still holds the
Spokesperson Rule is to ask it.

## Changing what the bot knows

Edit `src/content/*.ts`. That is also the entire procedure, and it is the point: the page and the
bot are the same commit. There is no second place to keep in sync, because the last time there was
one it rotted for months and had to be deleted.

If you want the bot to be able to say something, put it on the site. If it isn't worth showing a
visitor, it isn't worth telling a recruiter.

## The guards

Three, in the order that they matter.

**1. The Vercel WAF rate-limit rule. Not in this repo - it is dashboard config, and it is the one
Vercel-specific thing in the whole design.** It runs at the edge, *before* the function is invoked,
so abuse costs nothing: no invocation, no LLM token, no quota. Hobby includes one free rule per
project.

Set it up: Vercel dashboard -> your project -> Firewall -> Rate Limiting.

| | |
|---|---|
| Path | `/api/chat` |
| Limit | 20 requests per 60s |
| Key | IP address |
| Action | Deny |

Tune the number if it bites real visitors. It exists to stop a `for` loop, not a curious human.

**2. Stateless caps** (`guards.ts`). The browser sends the whole conversation, so the server just
counts it: 10 messages, 500 characters each. Plain `if`s - no storage, no service. This also rejects
the one forgery that matters: a client-supplied `system` turn trying to rewrite the bot's rules.

**3. The circuit-breaker** (`store.ts`). A global daily counter in Redis, below the provider's free
ceiling, so exhaustion is a decision we made rather than an error we discovered.

**Never add an in-memory rate limiter.** A module-scope `Map` of IP to counter is *silently broken*
on serverless: each request may hit a fresh instance with empty memory, and instances are destroyed
at will. It appears to work locally and does nothing in production.

## Failure

Every failure - guard trip, spent budget, dead provider, malformed request, unhandled throw -
surfaces as ordinary assistant text pointing at Adi's email. Never a status code, never a stack
trace, never a spinner that stops.

This is not politeness. A recruiter who meets a polished fallback thinks *considered*; one who meets
`429 Too Many Requests` thinks *broken* - and they are the exact person this feature exists to
impress.

## The evals

```sh
pnpm eval
```

~20 adversarial questions against the real model, asserting on shape rather than exact strings
(a model is not a pure function; an eval that string-matches is an eval that fails randomly).

It is doing two jobs:

- **It is the only thing enforcing the Spokesperson Rule.** Nothing in the architecture stops the
  bot telling a hiring manager that Adi doesn't know Kubernetes. A system prompt is a strongly
  worded request to a probabilistic system, not a guarantee. **Treat a failing eval as a release
  blocker.**
- **It is how you decide whether the free model is good enough.** If Flash-Lite fails several,
  that's the signal to move up a tier - and without it, that call is a guess.

It is not in CI and not in `pnpm test`: it costs real quota and real seconds. Run it before you
deploy, and every time you touch the prompt or the model.
