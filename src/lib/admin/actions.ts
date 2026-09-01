"use server";

import { redirect } from "next/navigation";
import type { z } from "zod";
import { experienceFileSchema } from "@/content/experience";
import { githubFileSchema } from "@/content/github";
import { hiringFaqSchema } from "@/content/hiring";
import { projects, projectSchema, projectsSchema } from "@/content/projects";
import { siteSchema } from "@/content/site";
import { skillsFileSchema } from "@/content/skills";
import { assertAdminEnabled } from "./enabled";
import {
  decodeExperienceFile,
  decodeGithubFile,
  decodeHiringList,
  decodeProject,
  decodeSite,
  decodeSkillsFile,
  text,
} from "./forms";
import { writeContentJson } from "./write";

export type SaveState =
  | { status: "idle" }
  | { status: "saved" }
  | { status: "error"; message: string };

function invalid(error: z.ZodError): SaveState {
  return {
    status: "error",
    message: error.issues
      .map((issue) => `${issue.path.join(".") || "form"}: ${issue.message}`)
      .join(" · "),
  };
}

export async function saveSite(_prev: SaveState, formData: FormData): Promise<SaveState> {
  assertAdminEnabled();
  const parsed = siteSchema.safeParse(decodeSite(formData));
  if (!parsed.success) return invalid(parsed.error);
  await writeContentJson("site.json", parsed.data);
  return { status: "saved" };
}

export async function saveExperience(_prev: SaveState, formData: FormData): Promise<SaveState> {
  assertAdminEnabled();
  const parsed = experienceFileSchema.safeParse(decodeExperienceFile(formData));
  if (!parsed.success) return invalid(parsed.error);
  await writeContentJson("experience.json", parsed.data);
  return { status: "saved" };
}

export async function saveSkills(_prev: SaveState, formData: FormData): Promise<SaveState> {
  assertAdminEnabled();
  const parsed = skillsFileSchema.safeParse(decodeSkillsFile(formData));
  if (!parsed.success) return invalid(parsed.error);
  await writeContentJson("skills.json", parsed.data);
  return { status: "saved" };
}

export async function saveHiring(_prev: SaveState, formData: FormData): Promise<SaveState> {
  assertAdminEnabled();
  const parsed = hiringFaqSchema.safeParse(decodeHiringList(formData));
  if (!parsed.success) return invalid(parsed.error);
  await writeContentJson("hiring.json", parsed.data);
  return { status: "saved" };
}

export async function saveGithub(_prev: SaveState, formData: FormData): Promise<SaveState> {
  assertAdminEnabled();
  const parsed = githubFileSchema.safeParse(decodeGithubFile(formData));
  if (!parsed.success) return invalid(parsed.error);
  await writeContentJson("github.json", parsed.data);
  return { status: "saved" };
}

/** `/admin/projects/new` is the creation route, so no project may claim it. */
function slugIsReserved(slug: string): SaveState | null {
  return slug === "new" ? { status: "error", message: 'slug: "new" is reserved' } : null;
}

export async function saveProject(_prev: SaveState, formData: FormData): Promise<SaveState> {
  assertAdminEnabled();
  const originalSlug = text(formData, "originalSlug");
  if (!projects.some((p) => p.slug === originalSlug)) {
    return { status: "error", message: `No project with slug "${originalSlug}"` };
  }
  const parsed = projectSchema.safeParse(decodeProject(formData));
  if (!parsed.success) return invalid(parsed.error);
  const reserved = slugIsReserved(parsed.data.slug);
  if (reserved) return reserved;
  const list = projectsSchema.safeParse(
    projects.map((p) => (p.slug === originalSlug ? parsed.data : p)),
  );
  if (!list.success) return invalid(list.error);
  await writeContentJson("projects.json", list.data);
  if (parsed.data.slug !== originalSlug) redirect(`/admin/projects/${parsed.data.slug}`);
  return { status: "saved" };
}

export async function createProject(_prev: SaveState, formData: FormData): Promise<SaveState> {
  assertAdminEnabled();
  const parsed = projectSchema.safeParse(decodeProject(formData));
  if (!parsed.success) return invalid(parsed.error);
  const reserved = slugIsReserved(parsed.data.slug);
  if (reserved) return reserved;
  const list = projectsSchema.safeParse([...projects, parsed.data]);
  if (!list.success) return invalid(list.error);
  await writeContentJson("projects.json", list.data);
  redirect(`/admin/projects/${parsed.data.slug}`);
}

export async function deleteProject(formData: FormData): Promise<void> {
  assertAdminEnabled();
  const slug = text(formData, "originalSlug");
  const remaining = projects.filter((p) => p.slug !== slug);
  if (remaining.length === projects.length) {
    throw new Error(`No project with slug "${slug}"`);
  }
  if (remaining.length === 0) {
    throw new Error("Refusing to delete the last project.");
  }
  await writeContentJson("projects.json", projectsSchema.parse(remaining));
  redirect("/admin/projects");
}
