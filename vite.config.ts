import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(root, "src"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart(),
    nitro({
      routeRules: {
        // Fingerprinted build files never change, so browsers can keep them for a year.
        "/assets/**": {
          headers: { "Cache-Control": "public, max-age=31536000, immutable" },
        },
        // Photos, fonts and PDFs keep their file names, so cache for a week.
        "/products/**": { headers: { "Cache-Control": "public, max-age=604800" } },
        "/catalogue-pages/**": { headers: { "Cache-Control": "public, max-age=604800" } },
        "/catalogues/**": { headers: { "Cache-Control": "public, max-age=604800" } },
        "/site/**": { headers: { "Cache-Control": "public, max-age=604800" } },
        "/fonts/**": { headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
        "/**": {
          headers: {
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "SAMEORIGIN",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
          },
        },
      },
    }),
    viteReact(),
  ],
});
