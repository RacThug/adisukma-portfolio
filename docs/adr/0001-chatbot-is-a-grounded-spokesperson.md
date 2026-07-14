# The chatbot is a grounded spokesperson, not a stand-in

The portfolio chatbot answers a Visitor's questions about Adi so a busy hiring partner does not have to skim
the site. It speaks in Adi's name to people deciding whether to hire him, so its failure mode is
reputational, not technical. We therefore constrain it hard.

**Decided:**

1. **It is an answering machine.** It answers questions and nothing else. No lead capture, no calendar, no
   tools, no writes, no side effects, no personal data at rest. A recruiter who is convinced will click the
   email link; one who is not will not hand their details to a bot.
2. **Its Corpus is derived from `src/content/*.ts`,** the same modules the pages render. It is built at
   request time from `site`, `projects`, `experience`, `education` and `skillGroups`. The corpus is ~1,000
   words, so it is stuffed into the system prompt whole. No embeddings, no vector store, no retrieval.
3. **The Spokesperson Rule.** Where the Corpus is silent, the bot performs a Handoff to Adi's email. It never
   guesses, never infers, and in particular never denies: an unlisted skill is reported as Not Listed, never
   as "he does not know it".

**Why derived and not hand-written.** A hand-maintained bot brief is a second account of Adi that rots
silently. `docs/portfolio-content-reference.md` is the proof: it still describes a "Renovation Sales
Platform" and AI-first branding that were removed from the site in `3c77ca4`. Nothing forced it to stay
honest, so it did not. Deriving the Corpus makes drift structurally impossible: a project added to
`projects.ts` reaches the page and the bot in the same commit. `docs/portfolio-content-reference.md` is
therefore not a chatbot source and must never be fed to it.

**Why the bot never infers.** A chattier bot that reasons from "open to on-site" to "yes, he would move to
Jakarta" is more helpful right up to the moment it commits Adi, in writing, to a hiring manager, to something
he did not agree to. The cost of this rule is that the bot reads as slightly stiff and occasionally evasive
("that is not listed"). That is the intended trade: stiff and correct beats warm and wrong when the reader is
deciding whether to hire you.

**Consequence.** Anything the bot should be able to say must exist in `src/content/*.ts` and therefore on the
page. If a fact is worth telling a recruiter, it is worth showing a Visitor. Bot-only material is limited to
*behaviour* (refusal rules, tone, the Handoff text), never *facts*.
