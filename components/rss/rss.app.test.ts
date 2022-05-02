/* eslint-env jest */
import rss from "./rss.app";

const { createHTTPError } = rss.methods;

test("an HTTP 429 error throws", () => {
  expect(() => {
    throw createHTTPError(429, "Too Many Requests");
  }).toThrow();
});
