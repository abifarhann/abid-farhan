import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/dev",
  workers: 1,
  timeout: 120_000,
  reporter: "list",
  use: {
    browserName: "chromium",
    baseURL: "http://127.0.0.1:3101",
    viewport: { width: 1440, height: 1000 },
    navigationTimeout: 90_000,
  },
});
