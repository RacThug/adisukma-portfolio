# Portfolio

A personal portfolio site for Adi Sukma. It exists to convince a hiring partner, quickly, that Adi is worth
talking to. Every feature is judged against that: does it shorten the path from "who is this person" to
"let's talk".

## Language

### Chatbot

**Visitor**:
Anyone talking to the chatbot. Assume a recruiter or hiring partner who is short on time and will not read
the whole site.
_Avoid_: User, customer, lead

**Corpus**:
The complete set of facts the chatbot is allowed to state, derived from `src/content/*.ts`. If it is not in
the Corpus, the chatbot does not know it. The Corpus is a projection of what the site already shows, never a
second, separately maintained account of Adi.
_Avoid_: Knowledge base, training data, context

**Spokesperson Rule**:
The chatbot is a spokesperson, not a stand-in. It answers only from the Corpus. Where the Corpus is silent it
does not guess, infer, or deny. It performs a Handoff instead.

**Handoff**:
The chatbot's response when the Corpus does not cover the question: it says so plainly and points the Visitor
at Adi's email. A Handoff is a successful outcome, not a failure.
_Avoid_: Fallback, error, I don't know

**Not Listed**:
The only thing the chatbot may say about a skill, tool, or experience absent from the Corpus. "Kubernetes is
not listed among his skills" is permitted. "He does not know Kubernetes" is not: that is a claim about Adi
that Adi never authorised.
_Avoid_: No, he can't, he hasn't

**Question Log**:
The record of what Visitors ask, kept to find gaps in the site: if forty people ask about a skill the site
never mentions, that is a portfolio gap, not a chatbot gap. It holds questions and nothing else - no answers,
no conversation threading, no IP addresses - and entries expire. A Question Log that could reconstruct a
person is not a Question Log; it is a transcript, and we do not keep transcripts.
_Avoid_: Transcript, conversation history, analytics
