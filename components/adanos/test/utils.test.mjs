import assert from "node:assert/strict";
import test from "node:test";

import {
  buildWindow,
  normalizeAssetType,
  normalizeIdentifier,
  normalizeIdentifiers,
  normalizeLimit,
  normalizeSource,
} from "../common/utils.mjs";

test("buildWindow accepts valid optional ISO dates", () => {
  assert.deepEqual(buildWindow("2026-06-01", "2026-06-30"), {
    from: "2026-06-01",
    to: "2026-06-30",
  });
  assert.deepEqual(buildWindow(undefined, ""), {});
});

test("buildWindow rejects invalid and reversed dates", () => {
  assert.throws(() => buildWindow("2026-02-30", undefined), /YYYY-MM-DD/);
  assert.throws(() => buildWindow("2026-07-01", "2026-06-30"), /must not be after/);
});

test("source and asset type normalization use documented values", () => {
  assert.equal(normalizeSource(" X "), "x");
  assert.equal(normalizeAssetType(" CRYPTO "), "crypto");
  assert.throws(() => normalizeSource("telegram"), /Stock Source/);
  assert.throws(() => normalizeAssetType("forex"), /Asset Type/);
});

test("identifiers are normalized and constrained", () => {
  assert.equal(normalizeIdentifier(" $aapl ", false), "AAPL");
  assert.equal(normalizeIdentifier("brk.a", false), "BRK.A");
  assert.equal(normalizeIdentifier(" $btc ", true), "BTC");
  assert.throws(() => normalizeIdentifier("not/a/ticker", false), /stock ticker/);
  assert.throws(() => normalizeIdentifier("", true), /crypto symbol/);
});

test("identifier lists are normalized, deduplicated, and limited", () => {
  assert.deepEqual(normalizeIdentifiers([
    " aapl ",
    "$MSFT",
    "AAPL",
  ], false), [
    "AAPL",
    "MSFT",
  ]);
  assert.deepEqual(normalizeIdentifiers("btc, $ETH", true), [
    "BTC",
    "ETH",
  ]);
  assert.throws(
    () => normalizeIdentifiers(Array.from({
      length: 11,
    }, (_, index) => `S${index}`), true),
    /at most 10/,
  );
});

test("limit must be an integer in the API range", () => {
  assert.equal(normalizeLimit(undefined), 20);
  assert.equal(normalizeLimit("100"), 100);
  for (const invalid of [
    0,
    101,
    1.5,
    "many",
  ]) {
    assert.throws(() => normalizeLimit(invalid), /integer from 1 to 100/);
  }
});
