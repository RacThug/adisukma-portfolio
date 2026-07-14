import { defineConfig } from "vitest/config";

import { alias } from "./vitest.alias";

export default defineConfig({
  resolve: { alias },
  test: {
    // The evals talk to a real model over the network: slow, quota-consuming,
    // and non-deterministic. They run deliberately via `pnpm eval`, never here.
    include: ["src/**/*.test.ts"],
  },
});
