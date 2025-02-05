export default {
  testEnvironment: "node",
  roots: [
    "<rootDir>/src",
  ],
  testMatch: [
    "**/__tests__/**/*.ts",
    "**/?(*.)+(spec|test).ts",
  ],
  moduleFileExtensions: [
    "ts",
    "js",
  ],
  moduleNameMapper: {
    "^(.+)\\.js$": "$1",
  },
  extensionsToTreatAsEsm: [
    ".ts",
  ],
  transform: {
    // '^.+\\.[tj]sx?$' to process ts,js,tsx,jsx with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process ts,js,tsx,jsx,mts,mjs,mtsx,mjsx with `ts-jest`
    "^.+\\.[jt]sx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.node.json",
        useESM: true,
      },
    ],
  },
};
