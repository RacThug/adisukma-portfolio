# Adi Sukma - Portfolio

My personal portfolio, built with the same stack I ship professionally - and with an **AI chatbot that answers questions about me as a grounded spokesperson**, not a generic assistant.

ðŸ”— **Live:** [adisukma-portfolio.vercel.app](https://adisukma-portfolio.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-000000?style=flat&logo=vercel&logoColor=white)
![Vitest](https://img.shields.io/badge/Tested_with_Vitest-6E9F18?style=flat&logo=vitest&logoColor=white)

## The AI chatbot

The interesting part. It is designed to be reliable and cheap enough to leave running for strangers (recruiters), which drove a few deliberate decisions - each written up as an ADR in [`docs/adr/`](docs/adr):

- **Grounded spokesperson, not a chatbot** - it answers *about me* from curated context, and declines the rest. ([ADR 0001](docs/adr/0001-chatbot-is-a-grounded-spokesperson.md))
- **Provider is config, not code** - Gemini (free tier) as primary with an OpenRouter fallback, both spoken to over the OpenAI wire format, so swapping models is a one-line env change. ([ADR 0002](docs/adr/0002-llm-provider-is-config-not-code.md))
- **The server remembers nothing** - stateless request handling; no conversation is stored server-side. ([ADR 0003](docs/adr/0003-the-server-remembers-nothing.md))
- **Log questions, never conversations** - a privacy-preserving question log (Upstash Redis) captures *what* people ask, never their full exchange. ([ADR 0004](docs/adr/0004-log-questions-never-conversations.md))
- **A daily-budget circuit breaker** - the bot hands off gracefully before it hits a provider's rate limit, so "out of budget" is a decision, not a 429 a recruiter discovers.

All API keys are server-side only (no `NEXT_PUBLIC_`), read from environment variables and never committed. See [`docs/chatbot.md`](docs/chatbot.md) and [`.env.example`](.env.example).

## Tech stack

| Area | Tools |
|------|-------|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| AI | Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`) |
| Infra | Upstash Redis, Vercel |
| Testing | Vitest (unit + evals) |

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in CHAT_PRIMARY_API_KEY (optional for UI-only work)

pnpm dev        # dev server at http://localhost:3000
pnpm typecheck  # tsc --noEmit
pnpm lint
pnpm test       # vitest
pnpm eval       # chatbot evals
```

The site runs fine with no AI keys set - the chatbot degrades gracefully rather than breaking the page.

## Project structure

```
src/
  app/            # App Router pages + /api/chat route (server-side)
  lib/chat/       # provider abstraction, circuit breaker, question log
public/           # static assets (incl. CV)
docs/adr/         # architecture decision records
docs/chatbot.md   # chatbot design notes
```

## License

Personal project. Content Â© Adi Sukma.
