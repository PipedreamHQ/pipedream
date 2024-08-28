module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: [
    "@typescript-eslint",
  ],
  rules: {},
  ignorePatterns: [
    "node_modules/",
    ".eslintrc.js",
  ],
};

