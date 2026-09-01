import { LinesField, TextField } from "@/components/admin/fields";
import { SaveForm } from "@/components/admin/save-form";
import { featuredRepos, githubOwner } from "@/content/github";
import { saveGithub } from "@/lib/admin/actions";

export default function AdminGithubPage() {
  return (
    <main>
      <h1 className="mb-6 font-mono text-lg font-bold text-ink"># github</h1>
      <SaveForm action={saveGithub}>
        <TextField label="owner" name="githubOwner" defaultValue={githubOwner} required />
        <LinesField
          label="featured repos"
          name="featuredRepos"
          values={featuredRepos}
          hint="one repo name per line. An allowlist, never a feed: add a repo only if you would be happy to have a hiring partner open it cold."
          required
        />
      </SaveForm>
    </main>
  );
}
