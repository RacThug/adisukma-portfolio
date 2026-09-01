"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";
import type { SaveState } from "@/lib/admin/actions";

const initialState: SaveState = { status: "idle" };

/**
 * The one client boundary in the admin. Fields stay server-rendered and come
 * in as children; this wrapper only owns the submit lifecycle: pending state
 * and the inline verdict from the Server Action.
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
          className={`text-sm ${state.status === "error" ? "text-accent" : "text-muted"}`}
        >
          {state.status === "error" && state.message}
          {state.status === "saved" && "saved - unpublished until you commit"}
        </p>
      </div>
    </form>
  );
}
