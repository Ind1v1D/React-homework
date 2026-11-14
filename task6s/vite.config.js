import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the build works from any sub-folder (GitHub Pages passes --base)
export default defineConfig({
  plugins: [react()],
  base: "./",
});
