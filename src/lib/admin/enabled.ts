/**
 * The admin exists only under `next dev`. In production every admin page 404s
 * and every admin action refuses, so the deployed site carries no write
 * surface at all: publishing is a git commit, not a request.
 */
export function adminEnabled(): boolean {
  return process.env.NODE_ENV === "development";
}

export function assertAdminEnabled(): void {
  if (!adminEnabled()) {
    throw new Error("The content admin only runs in development.");
  }
}
