import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 90_000,
  use: { baseURL: "http://localhost:3000" },
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 240_000,
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true } },
    { name: "reduced", use: { viewport: { width: 1440, height: 900 }, contextOptions: { reducedMotion: "reduce" } } },
  ],
});
