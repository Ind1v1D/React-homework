import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// Relative base so the build works from any sub-folder (GitHub Pages passes --base)
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.js",
      registerType: "prompt",
      injectRegister: false,
      manifest: false, // we ship our own public/manifest.json
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico,json}"],
      },
      devOptions: { enabled: false },
    }),
  ],
  base: "./",
});
