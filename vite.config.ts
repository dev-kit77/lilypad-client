import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 8080,
  },
});
