import { writeFile } from "node:fs/promises";
import path from "node:path";
import { assertAdminEnabled } from "./enabled";

const contentDir = path.join(process.cwd(), "src", "content");

const writableFiles = new Set([
  "site.json",
  "projects.json",
  "experience.json",
  "skills.json",
  "hiring.json",
  "github.json",
]);

export async function writeContentJson(fileName: string, value: unknown): Promise<void> {
  assertAdminEnabled();
  if (!writableFiles.has(fileName)) {
    throw new Error(`Not a writable content file: ${fileName}`);
  }
  // Two-space indent plus a trailing newline, matching how the files are
  // committed, so a save that changes one field diffs as one field. UTF-8
  // without a BOM: Turbopack refuses to parse JSON that carries one.
  await writeFile(path.join(contentDir, fileName), JSON.stringify(value, null, 2) + "\n", "utf8");
}
