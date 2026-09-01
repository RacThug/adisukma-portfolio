import { Fieldset, LinesField, TextField } from "@/components/admin/fields";
import { SaveForm } from "@/components/admin/save-form";
import { skillGroups, topSkills, waysOfWorking } from "@/content/skills";
import { saveSkills } from "@/lib/admin/actions";

export default function AdminSkillsPage() {
  return (
    <main>
      <h1 className="mb-6 font-mono text-lg font-bold text-ink"># skills</h1>
      <SaveForm action={saveSkills}>
        <input type="hidden" name="count" value={skillGroups.length + 1} />
        <LinesField label="top skills" name="topSkills" values={topSkills} required />
        {skillGroups.map((group, i) => (
          <Fieldset key={group.label} legend={`group: ${group.label}`}>
            <TextField label="label" name={`${i}.label`} defaultValue={group.label} />
            <LinesField label="items" name={`${i}.items`} values={group.items} />
          </Fieldset>
        ))}
        <Fieldset legend="new group">
          <p className="text-xs text-muted">
            Leave blank to skip. To remove a group above, clear its label and items.
          </p>
          <TextField label="label" name={`${skillGroups.length}.label`} />
          <LinesField label="items" name={`${skillGroups.length}.items`} values={[]} />
        </Fieldset>
        <LinesField label="ways of working" name="waysOfWorking" values={waysOfWorking} required />
      </SaveForm>
    </main>
  );
}
