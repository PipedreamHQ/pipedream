/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
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
        "useESM": true,
      },
    ],
  },
};
