import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "./src/index.ts",
  },
  format: [
    "cjs",
    "esm",
  ],
  minify: true,
  sourcemap: true,
  dts: true,
  clean: true,
});
