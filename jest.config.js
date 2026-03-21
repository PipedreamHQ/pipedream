/**
 * Component tests that `import` native ESM `.mjs` modules (e.g. ServiceM8) rely on
 * Node’s ESM loader. The root `test` script sets NODE_OPTIONS=--experimental-vm-modules.
 * @type {import('ts-jest/dist/types').InitialOptionsTsJest}
 */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // See https://kulshekhar.github.io/ts-jest/docs/guides/esm-support
  extensionsToTreatAsEsm: [
    ".js",
    ".ts",
    ".mts",
  ],
  moduleNameMapper: {
    "^(.+)\\.js$": "$1",
  },
  testPathIgnorePatterns: [
    "types/.*.types.test..*$",
  ],
  transform: {
    "\\.[jt]s$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          module: "ESNext",
          moduleResolution: "bundler",
          target: "ES2022",
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          noEmit: true,
        },
      },
    ],
  },
};
