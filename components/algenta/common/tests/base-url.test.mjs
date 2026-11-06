import assert from "node:assert/strict";
import {
  describe,
  it,
} from "node:test";
import algenta from "../../algenta.app.mjs";

function buildClient(baseUrl) {
  return algenta.methods._client.call({
    $auth: {
      api_key: "test-key",
      base_url: baseUrl,
    },
  });
}

describe("Algenta base URL validation", () => {
  for (const baseUrl of [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://[::1]:8000",
    "https://engine.example.com",
  ]) {
    it(`accepts ${baseUrl}`, () => {
      assert.equal(buildClient(baseUrl).baseUrl, baseUrl);
    });
  }

  for (const baseUrl of [
    "http://example.com",
    "ftp://[::1]:8000",
    "not-a-url",
  ]) {
    it(`rejects ${baseUrl}`, () => {
      assert.throws(() => buildClient(baseUrl));
    });
  }
});
