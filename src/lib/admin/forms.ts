/**
 * FormData -> candidate content objects, in the same key order the JSON files
 * are committed in, so a one-field edit diffs as one field. Decoders shape;
 * the content schemas judge. Nothing here throws on bad input - that is the
 * schema's job, and it reports every problem at once instead of the first.
 */

export function text(fd: FormData, name: string): string {
  const value = fd.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Untrimmed. The site tagline renders as three concatenated spans, so
 * "Building " keeps its trailing space on purpose; trimming it here would
 * silently reflow the hero on every save.
 */
export function raw(fd: FormData, name: string): string {
  const value = fd.get(name);
  return typeof value === "string" ? value : "";
}

function optional(value: string): string | undefined {
  return value === "" ? undefined : value;
}

/** One item per line; blank lines dropped. */
export function lines(fd: FormData, name: string): string[] {
  return text(fd, name)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "");
}

/** One paragraph per blank line; inner line breaks collapse to spaces. */
export function paragraphs(fd: FormData, name: string): string[] {
  return text(fd, name)
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.replace(/\s+/g, " ").trim())
    .filter((block) => block !== "");
}

/** How many repeated fieldsets the form rendered, from a hidden `count` input. */
function entryCount(fd: FormData): number {
  const count = Number(text(fd, "count"));
  return Number.isInteger(count) && count > 0 ? count : 0;
}

export function decodeSite(fd: FormData): unknown {
  return {
    name: text(fd, "name"),
    role: text(fd, "role"),
    location: text(fd, "location"),
    email: text(fd, "email"),
    linkedin: text(fd, "linkedin"),
    github: text(fd, "github"),
    url: text(fd, "url"),
    availability: text(fd, "availability"),
    tagline: {
      pre: raw(fd, "tagline.pre"),
      highlight: text(fd, "tagline.highlight"),
      post: raw(fd, "tagline.post"),
    },
    intro: text(fd, "intro"),
    shortBio: text(fd, "shortBio"),
    longBio: paragraphs(fd, "longBio"),
    cvPath: text(fd, "cvPath"),
    cvDownloadName: text(fd, "cvDownloadName"),
  };
}

export function decodeProject(fd: FormData): unknown {
  return {
    slug: text(fd, "slug"),
    index: text(fd, "index"),
    title: text(fd, "title"),
    type: text(fd, "type"),
    role: text(fd, "role"),
    summary: text(fd, "summary"),
    problem: text(fd, "problem"),
    built: text(fd, "built"),
    highlights: lines(fd, "highlights"),
    tech: lines(fd, "tech"),
    featuredTech: lines(fd, "featuredTech"),
    liveUrl: optional(text(fd, "liveUrl")),
    repoUrl: optional(text(fd, "repoUrl")),
  };
}

export function decodeExperienceFile(fd: FormData): unknown {
  const entries: unknown[] = [];
  for (let i = 0; i < entryCount(fd); i++) {
    const title = text(fd, `${i}.title`);
    const company = text(fd, `${i}.company`);
    const description = text(fd, `${i}.description`);
    // An all-blank fieldset is the "leave blank to skip" row, or a deletion.
    if (title === "" && company === "" && description === "") continue;
    const stack = text(fd, `${i}.stack`);
    entries.push({
      title,
      company,
      meta: text(fd, `${i}.meta`),
      period: text(fd, `${i}.period`),
      ...(fd.get(`${i}.current`) === "on" ? { current: true } : {}),
      description,
      ...(stack === "" ? {} : { stack }),
    });
  }
  return {
    experience: entries,
    education: {
      school: text(fd, "education.school"),
      degree: text(fd, "education.degree"),
    },
  };
}

export function decodeHiringList(fd: FormData): unknown {
  const entries: unknown[] = [];
  for (let i = 0; i < entryCount(fd); i++) {
    const question = text(fd, `${i}.question`);
    const answer = text(fd, `${i}.answer`);
    if (question === "" && answer === "") continue;
    entries.push({ question, answer });
  }
  return entries;
}

export function decodeSkillsFile(fd: FormData): unknown {
  const groups: unknown[] = [];
  for (let i = 0; i < entryCount(fd); i++) {
    const label = text(fd, `${i}.label`);
    const items = lines(fd, `${i}.items`);
    if (label === "" && items.length === 0) continue;
    groups.push({ label, items });
  }
  return {
    topSkills: lines(fd, "topSkills"),
    skillGroups: groups,
    waysOfWorking: lines(fd, "waysOfWorking"),
  };
}

export function decodeGithubFile(fd: FormData): unknown {
  return {
    githubOwner: text(fd, "githubOwner"),
    featuredRepos: lines(fd, "featuredRepos"),
  };
}
