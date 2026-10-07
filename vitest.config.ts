import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./", import.meta.url)) } },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    // Sala-do-Buscador/ is a separate local clone of this repo, not part of the app.
    exclude: ["node_modules/**", "e2e/**", ".next/**", "Sala-do-Buscador/**"],
  },
});
