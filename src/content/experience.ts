import { z } from "zod";
import data from "./experience.json";

export const experienceEntrySchema = z.strictObject({
  title: z.string().min(1),
  company: z.string().min(1),
  meta: z.string().min(1),
  period: z.string().min(1),
  current: z.boolean().optional(),
  description: z.string().min(1),
  stack: z.string().min(1).optional(),
});

export type ExperienceEntry = z.infer<typeof experienceEntrySchema>;

export const educationSchema = z.strictObject({
  school: z.string().min(1),
  degree: z.string().min(1),
});

export const experienceFileSchema = z.strictObject({
  experience: z.array(experienceEntrySchema).min(1),
  education: educationSchema,
});

const parsed = experienceFileSchema.parse(data);

export const experience: ExperienceEntry[] = parsed.experience;
export const education = parsed.education;
