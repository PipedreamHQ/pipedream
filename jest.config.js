/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // See https://kulshekhar.github.io/ts-jest/docs/guides/esm-support
  extensionsToTreatAsEsm: [
    ".ts",
    ".mts",
  ],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testPathIgnorePatterns: [
    "types/.*.types.test..*$",
  ],
};
