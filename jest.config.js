/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // See https://kulshekhar.github.io/ts-jest/docs/guides/esm-support
  // ".js" is rejected here — jest always infers it from the nearest package.json
  extensionsToTreatAsEsm: [
    ".ts",
    ".mts",
  ],
  // the default testMatch covers .js/.ts only, and components are written in .mjs
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
    "**/?(*.)+(spec|test).mjs",
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
  },
};
