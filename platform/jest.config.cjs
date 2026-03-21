/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  // Tests are plain CommonJS against `dist/`; do not run babel-jest (Babel 8's
  // loadPartialConfig is async-only and breaks older babel-jest cache paths).
  transform: {},
};
