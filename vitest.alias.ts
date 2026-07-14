import { fileURLToPath } from "node:url";

/** The `@/*` path alias from tsconfig. Shared by both Vitest configs. */
export const alias = {
  "@": fileURLToPath(new URL("./src", import.meta.url)),
};
