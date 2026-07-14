# The server remembers nothing; the browser owns the conversation

The chat route is pure: corpus in, question in, answer out. The browser holds the conversation and sends it
whole with every request. There are no sessions, no conversation store, and no server-side memory of who
asked what.

**Why not server-side sessions.** Every reason to keep them evaluates to "no" here. Persistence across
reloads is pointless (a Visitor asks three questions and leaves). There are no accounts to moderate or ban.
The conversation is capped short enough to send over the wire trivially. And on the privacy axis, storing
conversations is not neutral but actively *worse* - it means holding strangers' words, which we would then
have to disclose, retain, and delete.

**The forgery vector, and why we accept it.** A browser that sends the history can forge the history,
including fabricating an assistant turn to prime a jailbreak. This is real. It is also harmless: everything
the bot says is visible only to the person talking to it, and that person can already fabricate any screenshot
they like with devtools. Forgery grants no capability that editing a `<div>` does not already grant. We will
not add a database to defend against an attack whose payoff is identical to right-click, Inspect.

**Guards, in the order they matter.**

1. **Vercel WAF rate-limit rule** on the chat route, per IP. Runs at the edge, *before* the function is
   invoked, so abuse costs nothing - not a function call, not an LLM token. Hobby includes one rule.
2. **Stateless in-function caps.** Because the client sends the conversation, the server can simply count it:
   reject histories beyond ~10 messages and messages beyond ~500 characters. Plain `if` statements. No
   storage, no service, no dependency.
3. **Upstash Redis circuit-breaker.** A global daily cap that stops calling the provider before the free
   quota is fully drained, so exhaustion is a decision we make rather than an error we discover.

**Never write an in-memory rate limiter.** A module-scope `Map` of IP to counter is *silently broken* on
serverless: each request may hit a fresh instance with empty memory, and instances are destroyed at will. It
will appear to work locally and do nothing in production.

**Every failure surfaces as a Handoff.** Rate-limited, out of quota, provider down, request malformed: the
Visitor sees "I'm taking a break - reach Adi at madeadisukmameta@gmail.com", never a status code. A recruiter
who meets a polished fallback thinks *considered*. One who meets `429 Too Many Requests` thinks *broken*, and
they are the exact person this feature exists to impress.
