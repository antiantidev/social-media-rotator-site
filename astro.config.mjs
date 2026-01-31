// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://antiantidev.github.io",
  base: "/social-media-rotator-site/",
  vite: {
    plugins: [tailwindcss()],
  },
});
