import { z } from "zod";
import data from "./skills.json";

export const skillGroupSchema = z.strictObject({
  label: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});

export type SkillGroup = z.infer<typeof skillGroupSchema>;

export const skillsFileSchema = z.strictObject({
  topSkills: z.array(z.string().min(1)).min(1),
  skillGroups: z.array(skillGroupSchema).min(1),
  waysOfWorking: z.array(z.string().min(1)).min(1),
});

const parsed = skillsFileSchema.parse(data);

export const topSkills: string[] = parsed.topSkills;
export const skillGroups: SkillGroup[] = parsed.skillGroups;
export const waysOfWorking: string[] = parsed.waysOfWorking;
