"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";
import type { SaveState } from "@/lib/admin/errors";
import { FieldErrorsContext } from "./field-errors";

const initialState: SaveState = { status: "idle" };
const noErrors: Record<string, string> = {};

/**
 * The admin's client boundary. Fields subscribe to FieldErrorsContext and
 * render their own message next to the input; the footer keeps only the
 * form-level verdict.
 */
export function SaveForm({
  action,
  children,
}: {
  action: (prev: SaveState, formData: FormData) => Promise<SaveState>;
  children: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <FieldErrorsContext.Provider value={state.status === "error" ? state.fields : noErrors}>
      <form action={formAction} className="flex flex-col gap-5">
        {children}
        <div className="flex flex-wrap items-baseline gap-4 border-t border-line pt-4">
          <button
            type="submit"
            disabled={pending}
            className="rounded bg-accent px-4 py-2 font-mono text-sm font-bold text-accent-ink disabled:opacity-60"
          >
            {pending ? "saving..." : "save"}
          </button>
          <p
            aria-live="polite"
            className={`text-sm ${state.status === "error" ? "font-bold text-accent" : "text-muted"}`}
          >
            {state.status === "error" && state.message}
            {state.status === "saved" && "saved - unpublished until you commit"}
          </p>
        </div>
      </form>
    </FieldErrorsContext.Provider>
  );
}
