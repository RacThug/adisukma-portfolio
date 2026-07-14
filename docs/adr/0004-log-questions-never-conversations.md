# Log questions, never conversations

The Question Log stores the Visitor's question text and nothing else. Not the answer, not the conversation
thread, not an IP address, not a user agent. Entries are unthreaded, so no sequence of questions can be
reassembled into a person, and they carry a TTL of 30 days.

**Why log at all.** "What do recruiters actually ask about Adi?" is the most valuable thing this feature can
produce, and it is worth more than the chatbot. Forty people asking about a skill the site never mentions is
not a chatbot gap - it is a portfolio gap, surfaced by the bot. Over months this should reshape `skills.ts`
and the project write-ups.

**Why so little.** A recruiter may type "I'm hiring a backend lead at Acme, is he a fit?" - their employer,
their hiring plans, arguably their identity. Storing that indefinitely, on a free-tier Redis, with no
retention policy and no disclosure, is a small thing but not a nothing thing. An unthreaded, un-IP'd,
expiring question is about as close to anonymous as text gets.

The line is one of character, and it is easy to feel: *"I keep a list of the questions people ask"* and
*"I keep transcripts of conversations recruiters had with a bot that speaks as me"* are different sentences
about different people. We are the first one.

**Consequences.**

- **Do not "improve" this by adding threading, IPs, timestamps, or the bot's answers.** Each is individually
  reasonable and collectively reconstitutes the transcript we deliberately refused. If you find yourself
  wanting them, you want a different feature, and it needs its own ADR.
- The site carries a one-line privacy note disclosing the log. It costs nothing and makes the whole thing
  defensible - quietly harvesting recruiters' messages is not the impression a hiring portfolio is for.
- The chat widget discloses that it is an AI, up front, in the first frame. A Visitor who works it out three
  messages in feels tricked; one who knows immediately feels handed a tool.
