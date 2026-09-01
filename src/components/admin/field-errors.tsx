"use client";

import { createContext, useContext } from "react";

/** Field errors from the last save attempt, keyed by input name. */
export const FieldErrorsContext = createContext<Record<string, string>>({});

/**
 * Exact name first, then any error nested under it: "longBio.1" lands on the
 * "longBio" textarea, "2.items.0" on the "2.items" one - list fields are
 * edited as a single control, so their item-level issues belong to it.
 */
export function useFieldError(name: string): string | undefined {
  const errors = useContext(FieldErrorsContext);
  if (errors[name] !== undefined) return errors[name];
  const prefix = `${name}.`;
  for (const key of Object.keys(errors)) {
    if (key.startsWith(prefix)) return errors[key];
  }
  return undefined;
}
