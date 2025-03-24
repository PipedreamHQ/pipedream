import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    browser: "./src/browser/index.ts",
  },
  format: [
    "cjs",
    "esm",
  ],
  minify: true,
  sourcemap: true,
  dts: true,
  tsconfig: "./tsconfig.browser.json",
});
