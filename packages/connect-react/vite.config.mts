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
        "react",
        "react-dom",
        "react/jsx-runtime",
      ],
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
});
