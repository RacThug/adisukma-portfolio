import { config } from "dotenv";
import { defineConfig } from "vitest/config";

import { alias } from "./vitest.alias";

// The evals talk to a real model, so they need the real keys. Next loads these
// for us; Vitest does not. Both files, in Next's own precedence order - .env.local
// wins - because a key sitting in the "wrong" one of the two should not produce a
// "no provider configured" failure that sends you looking for a typo in the key.
config({ path: ".env", quiet: true });
config({ path: ".env.local", override: true, quiet: true });

export default defineConfig({
  resolve: { alias },
  test: {
    include: ["src/**/*.eval.ts"],
    // Sequential, on purpose. The free tier allows ~15 requests a minute, and an
    // eval suite that trips its own rate limit tells you nothing about the model.
    fileParallelism: false,
    sequence: { concurrent: false },
    testTimeout: 45_000,
    // A model is not a pure function. Retry a flake once before believing it -
    // but a test that only passes on retry is a warning, not a pass.
    retry: 1,
  },
});
