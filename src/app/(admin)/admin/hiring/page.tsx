import { Fieldset, TextAreaField, TextField } from "@/components/admin/fields";
import { SaveForm } from "@/components/admin/save-form";
import { hiringFaq } from "@/content/hiring";
import { saveHiring } from "@/lib/admin/actions";

export default function AdminHiringPage() {
  return (
    <main>
      <h1 className="mb-6 font-mono text-lg font-bold text-ink"># hiring faq</h1>
      <p className="mb-6 max-w-prose text-sm text-muted">
        Write answers you would be happy to hear quoted back in a first call, because they will
        be. And never restate a fact another section owns: a copied fact is a fact that rots.
      </p>
      <SaveForm action={saveHiring}>
        <input type="hidden" name="count" value={hiringFaq.length + 1} />
        {hiringFaq.map((entry, i) => (
          <Fieldset key={entry.question} legend={`question ${i + 1}`}>
            <TextField label="question" name={`${i}.question`} defaultValue={entry.question} />
            <TextAreaField label="answer" name={`${i}.answer`} defaultValue={entry.answer} />
          </Fieldset>
        ))}
        <Fieldset legend="new question">
          <p className="text-xs text-muted">
            Leave blank to skip. To remove a question above, clear both its fields.
          </p>
          <TextField label="question" name={`${hiringFaq.length}.question`} />
          <TextAreaField label="answer" name={`${hiringFaq.length}.answer`} />
        </Fieldset>
      </SaveForm>
    </main>
  );
}
