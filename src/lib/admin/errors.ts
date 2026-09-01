import type { z } from "zod";

export type SaveState =
  | { status: "idle" }
  | { status: "saved" }
  | { status: "error"; message: string; fields: Record<string, string> };

type PathMapper = (path: ReadonlyArray<PropertyKey>) => string;

const joinPath: PathMapper = (path) => path.map(String).join(".");

/**
 * Zod paths mostly match input names verbatim ("title", "tagline.pre",
 * "0.question"). The whole-file schemas wrap their list in a named key the
 * form never renders ("experience.0.title" vs the input's "0.title"), so
 * those actions strip that one segment.
 */
export function stripPrefix(prefix: string): PathMapper {
  return (path) => (path[0] === prefix ? joinPath(path.slice(1)) : joinPath(path));
}

/**
 * One message per field, keyed by input name, plus a form-level message for
 * issues that point at no field (e.g. the duplicate-slug refinement on the
 * whole project list).
 */
export function invalid(error: z.ZodError, mapPath: PathMapper = joinPath): SaveState {
  const fields: Record<string, string> = {};
  const formLevel: string[] = [];
  for (const issue of error.issues) {
    const name = mapPath(issue.path);
    if (name === "") {
      formLevel.push(issue.message);
    } else if (name in fields) {
      fields[name] += `; ${issue.message}`;
    } else {
      fields[name] = issue.message;
    }
  }
  const fieldCount = Object.keys(fields).length;
  return {
    status: "error",
    fields,
    message:
      formLevel.length > 0
        ? formLevel.join(" · ")
        : `Not saved: ${fieldCount} field${fieldCount === 1 ? "" : "s"} need${fieldCount === 1 ? "s" : ""} attention.`,
  };
}
