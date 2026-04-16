import * as path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    minify: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "connect-react",
      fileName: (format) => `connect-react.${format}.js`,
    },
    rollupOptions: {
      external: [
        "@emotion/react",
        "@tanstack/react-query",
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
      output: {
        globals: {
          "react": "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "react/jsx-runtime",
          "react/jsx-dev-runtime": "react/jsx-dev-runtime",
          "@emotion/react": "@emotion/react",
          "@tanstack/react-query": "reactQuery",
        },
      },
    },
  },
  resolve: {
    alias: {
      "decode-named-character-reference": "../../node_modules/decode-named-character-reference/index.js",
    },
    dedupe: [
      "@emotion/react",
    ],
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
      tsconfigPath: path.resolve(__dirname, "tsconfig.json"),
      afterDiagnostic: (diagnostics) => {
        if (diagnostics.length > 0) {
          throw new Error(`Build failed: ${diagnostics.length} TypeScript error(s) found`);
        }
      },
    }),
  ],
});
