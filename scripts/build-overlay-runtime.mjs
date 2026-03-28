import { mkdir } from "node:fs/promises";
import { build } from "esbuild";

await mkdir("public/scripts", { recursive: true });

await build({
  entryPoints: ["src/scripts/overlay.ts"],
  outfile: "public/scripts/overlay.js",
  bundle: true,
  format: "esm",
  platform: "browser",
  target: ["es2022"],
  legalComments: "none",
  sourcemap: false,
  minify: true,
});
