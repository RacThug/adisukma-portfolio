import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { clientFaq } from "@/content/hiring";

export function FaqList() {
  return (
    <dl className="max-w-3xl divide-y divide-line border-y border-line">
      {clientFaq.map((entry) => (
        <div
          key={entry.question}
          className="grid gap-2 py-6 md:grid-cols-[minmax(0,14rem)_1fr] md:gap-10"
        >
          {/*
            Two measurements, not two guesses.

            `pl-[2ch] -indent-[2ch]` hangs the `?` in the margin so a question
            that wraps lines its second line up under the first word instead of
            under the marker. `2ch` is exact rather than approximate because
            the face is monospaced: "? " is two characters, always.

            `md:pt-1` is baseline correction. The question is 14px on a 20px
            line, the answer 16px on a 26px line, so side by side their first
            baselines sit about 3px apart - not enough to name, enough to make
            every row look slightly loose. It applies only from `md`, since
            below that the two stack and there is no baseline to share.
          */}
          <dt className="pl-[2ch] -indent-[2ch] font-mono text-sm font-bold text-ink md:pt-1">
            <span aria-hidden className="text-accent">
              ?{" "}
            </span>
            {entry.question}
          </dt>
          <dd className="leading-relaxed text-ink/90">{entry.answer}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Faq() {
  return (
    <section id="faq" className="relative mx-auto max-w-5xl scroll-mt-24 px-6 py-20">
      {/* Old links to /#hiring still land on this section. */}
      <div id="hiring" className="absolute top-0 scroll-mt-24" />
      <SectionHeading path="faq" note="for clients" />
      <FaqList />
      <p className="mt-8 font-mono text-xs text-muted">
        <Link href="/services" className="text-accent hover:underline underline-offset-4">
          freelance services →
        </Link>
      </p>
    </section>
  );
}
