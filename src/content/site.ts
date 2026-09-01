import { z } from "zod";
import data from "./site.json";

/**
 * Identity and bio. The data lives in `site.json`; this module is the only way
 * in, so everything the pages and the chatbot corpus read has passed the
 * schema. A field that goes missing or empty fails the build, not the page.
 */
export const siteSchema = z.strictObject({
  name: z.string().min(1),
  role: z.string().min(1),
  location: z.string().min(1),
  email: z.email(),
  linkedin: z.url(),
  github: z.url(),
  url: z.url(),
  availability: z.string().min(1),
  tagline: z.strictObject({
    pre: z.string(),
    highlight: z.string().min(1),
    post: z.string(),
  }),
  intro: z.string().min(1),
  shortBio: z.string().min(1),
  longBio: z.array(z.string().min(1)).min(1),
  cvPath: z.string().startsWith("/"),
  cvDownloadName: z.string().min(1),
});

export type Site = z.infer<typeof siteSchema>;

export const site: Site = siteSchema.parse(data);
