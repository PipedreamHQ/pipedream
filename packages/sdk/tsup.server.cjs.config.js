import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    server: "./src/server/index.ts",
    cli: "./src/server/cli.ts",
  },
  format: "cjs",
  noExternal: [
    "oauth4webapi",
  ],
  minify: true,
  sourcemap: true,
  dts: true,
  tsconfig: "./tsconfig.node.json",
});
