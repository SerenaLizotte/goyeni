import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./playwright-tests",
  fullyParallel: false,
  retries: 0,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: process.env.API_BASE_URL || "http://localhost:4000",
    extraHTTPHeaders: {
      "Content-Type": "application/json",
    },
  },
});
