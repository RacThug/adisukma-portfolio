import { z } from "zod";
import data from "./projects.json";

export const projectSchema = z.strictObject({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "lowercase words separated by single hyphens"),
  /** Two-digit ordinal shown on the card ("01", "02", ...). */
  index: z.string().regex(/^\d{2}$/),
  title: z.string().min(1),
  type: z.string().min(1),
  role: z.string().min(1),
  summary: z.string().min(1),
  problem: z.string().min(1),
  built: z.string().min(1),
  highlights: z.array(z.string().min(1)).min(1),
  tech: z.array(z.string().min(1)).min(1),
  /** Subset of tech shown on the home-page card */
  featuredTech: z.array(z.string().min(1)).min(1),
  /** Public deployment, when the work is not client-confidential */
  liveUrl: z.url().optional(),
  /** Public source, when the work is not client-confidential */
  repoUrl: z.url().optional(),
});

export type Project = z.infer<typeof projectSchema>;

export const projectsSchema = z
  .array(projectSchema)
  .min(1)
  .refine((list) => new Set(list.map((p) => p.slug)).size === list.length, {
    message: "project slugs must be unique",
  });

export const projects: Project[] = projectsSchema.parse(data);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
