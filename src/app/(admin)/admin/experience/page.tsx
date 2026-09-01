import {
  CheckboxField,
  Fieldset,
  TextAreaField,
  TextField,
} from "@/components/admin/fields";
import { SaveForm } from "@/components/admin/save-form";
import { education, experience } from "@/content/experience";
import { saveExperience } from "@/lib/admin/actions";
import type { ExperienceEntry } from "@/content/experience";

const empty: ExperienceEntry = {
  title: "",
  company: "",
  meta: "",
  period: "",
  description: "",
};

function EntryFields({ index, entry }: { index: number; entry: ExperienceEntry }) {
  return (
    <>
      <TextField label="title" name={`${index}.title`} defaultValue={entry.title} />
      <TextField label="company" name={`${index}.company`} defaultValue={entry.company} />
      <TextField
        label="meta"
        name={`${index}.meta`}
        defaultValue={entry.meta}
        hint="e.g. Full-time · Hybrid · Denpasar, Bali"
      />
      <TextField
        label="period"
        name={`${index}.period`}
        defaultValue={entry.period}
        hint="e.g. Jun 2025 - Jul 2026"
      />
      <CheckboxField label="current role" name={`${index}.current`} defaultChecked={entry.current} />
      <TextAreaField
        label="description"
        name={`${index}.description`}
        defaultValue={entry.description}
      />
      <TextField
        label="stack"
        name={`${index}.stack`}
        defaultValue={entry.stack ?? ""}
        hint="optional"
      />
    </>
  );
}

export default function AdminExperiencePage() {
  return (
    <main>
      <h1 className="mb-6 font-mono text-lg font-bold text-ink"># experience</h1>
      <SaveForm action={saveExperience}>
        <input type="hidden" name="count" value={experience.length + 1} />
        {experience.map((entry, i) => (
          <Fieldset key={`${entry.company}-${entry.period}`} legend={`entry ${i + 1}`}>
            <EntryFields index={i} entry={entry} />
          </Fieldset>
        ))}
        <Fieldset legend="new entry">
          <p className="text-xs text-muted">
            Leave blank to skip. To remove an entry above, clear its title, company, and
            description.
          </p>
          <EntryFields index={experience.length} entry={empty} />
        </Fieldset>
        <Fieldset legend="education">
          <TextField
            label="school"
            name="education.school"
            defaultValue={education.school}
            required
          />
          <TextField
            label="degree"
            name="education.degree"
            defaultValue={education.degree}
            required
          />
        </Fieldset>
      </SaveForm>
    </main>
  );
}
