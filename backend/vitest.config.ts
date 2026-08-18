import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    exclude: ["node_modules", "playwright-tests/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "json", "html"],
      reportsDirectory: "./coverage",
      exclude: [
        "node_modules/**",
        "playwright-tests/**",
        "src/__tests__/**",
        "src/index.ts",
        "vitest.config.ts",
        "playwright.config.ts",
      ],
    },
  },
});
