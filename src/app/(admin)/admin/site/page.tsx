import { Fieldset, TextAreaField, TextField } from "@/components/admin/fields";
import { SaveForm } from "@/components/admin/save-form";
import { site } from "@/content/site";
import { saveSite } from "@/lib/admin/actions";

export default function AdminSitePage() {
  return (
    <main>
      <h1 className="mb-6 font-mono text-lg font-bold text-ink"># site</h1>
      <SaveForm action={saveSite}>
        <TextField label="name" name="name" defaultValue={site.name} required />
        <TextField label="role" name="role" defaultValue={site.role} required />
        <TextField label="location" name="location" defaultValue={site.location} required />
        <TextField label="email" name="email" defaultValue={site.email} required />
        <TextField label="linkedin" name="linkedin" defaultValue={site.linkedin} required />
        <TextField label="github" name="github" defaultValue={site.github} required />
        <TextField label="site url" name="url" defaultValue={site.url} required />
        <TextField
          label="availability"
          name="availability"
          defaultValue={site.availability}
          required
        />
        <Fieldset legend="tagline">
          <TextField
            label="pre"
            name="tagline.pre"
            defaultValue={site.tagline.pre}
            hint="rendered as-is before the highlight - a trailing space here is real"
          />
          <TextField
            label="highlight"
            name="tagline.highlight"
            defaultValue={site.tagline.highlight}
            required
          />
          <TextField
            label="post"
            name="tagline.post"
            defaultValue={site.tagline.post}
            hint="rendered as-is after the highlight - a leading space here is real"
          />
        </Fieldset>
        <TextAreaField label="intro" name="intro" defaultValue={site.intro} required />
        <TextAreaField label="short bio" name="shortBio" defaultValue={site.shortBio} required />
        <TextAreaField
          label="long bio"
          name="longBio"
          defaultValue={site.longBio.join("\n\n")}
          rows={12}
          hint="one paragraph per blank line"
          required
        />
        <TextField label="cv path" name="cvPath" defaultValue={site.cvPath} required />
        <TextField
          label="cv download name"
          name="cvDownloadName"
          defaultValue={site.cvDownloadName}
          required
        />
      </SaveForm>
    </main>
  );
}
