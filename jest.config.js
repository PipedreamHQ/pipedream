/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // See https://kulshekhar.github.io/ts-jest/docs/guides/esm-support
  extensionsToTreatAsEsm: [
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
        "useESM": true,
      },
    ],
    // Allow `require()` of component `.mjs` app modules in Jest without
    // `import()` / NODE_OPTIONS=--experimental-vm-modules.
    "\\.mjs$": [
      "babel-jest",
      {
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                node: "current",
              },
              modules: "commonjs",
            },
          ],
        ],
      },
    ],
  },
};
