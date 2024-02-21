import { default as chromium } from "@sparticuz/chromium";

export default async function getExecutablePath() {
  patchEnv();
  return await chromium.executablePath();
}

/**
 * Patch the environment to make it compatible with @spartacuz/chromium@121.0.0 and AWS Lambda
 * Node.js 20.x. @spartacuz/chromium extracts required files to /tmp/fonts and /tmp/al2023/lib only
 * if the AWS_EXECUTION_ENV includes "20.x".
 * @see
 * {@link https://github.com/Sparticuz/chromium/blob/6e07eb0d63aadbfa60914b1460e04b9fcf75de30/source/index.ts#L327-L341 chromium/source/index.ts}
 */
function patchEnv() {
  process.env["AWS_EXECUTION_ENV"] = "nodejs20.x";
  process.env["FONTCONFIG_PATH"] = "/tmp/fonts";
  if (process.env["LD_LIBRARY_PATH"] === undefined) {
    process.env["LD_LIBRARY_PATH"] = "/tmp/al2023/lib";
  } else if (
    process.env["LD_LIBRARY_PATH"].startsWith("/tmp/al2023/lib") !== true
  ) {
    process.env["LD_LIBRARY_PATH"] = [
      ...new Set([
        "/tmp/al2023/lib",
        ...process.env["LD_LIBRARY_PATH"].split(":"),
      ]),
    ].join(":");
  }
}
