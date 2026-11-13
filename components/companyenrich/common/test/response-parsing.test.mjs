import assert from "node:assert/strict";
import { test } from "node:test";
import {
  parseResponse,
  safeAccount,
} from "../utils.mjs";

const numericCases = [
  {
    name: "long fractional score",
    token: "0.12345678901234567",
    expected: 0.12345678901234566,
  },
  {
    name: "fractional credits",
    token: "0.30000000000000004",
    expected: 0.30000000000000004,
  },
  {
    name: "negative decimal",
    token: "-123.45678901234567",
    expected: -123.45678901234567,
  },
  {
    name: "safe 16-digit integer",
    token: "1234567890123456",
    expected: 1234567890123456,
  },
  {
    name: "maximum safe integer",
    token: "9007199254740991",
    expected: Number.MAX_SAFE_INTEGER,
  },
  {
    name: "minimum safe integer",
    token: "-9007199254740991",
    expected: Number.MIN_SAFE_INTEGER,
  },
  {
    name: "first unsafe integer",
    token: "9007199254740992",
    expected: "9007199254740992",
  },
  {
    name: "integer otherwise rounded by native JSON parsing",
    token: "9007199254740993",
    expected: "9007199254740993",
  },
  {
    name: "maximum person ID",
    token: "9223372036854775807",
    expected: "9223372036854775807",
  },
  {
    name: "minimum int64",
    token: "-9223372036854775808",
    expected: "-9223372036854775808",
  },
  {
    name: "fraction with exponent",
    token: "1.2345678901234567e-5",
    expected: Number("1.2345678901234567e-5"),
  },
  {
    name: "short exponent yielding an unsafe integer",
    token: "1e20",
    expected: "100000000000000000000",
  },
  {
    name: "exponent retaining the exact person ID",
    token: "9.223372036854775807e18",
    expected: "9223372036854775807",
  },
  {
    name: "negative exponent yielding a safe integer",
    token: "1234567890123456000e-3",
    expected: 1234567890123456,
  },
  {
    name: "decimal notation yielding an unsafe exact integer",
    token: "9223372036854775807.0",
    expected: "9223372036854775807",
  },
  {
    name: "long decimal rounding to a safe integer",
    token: "1.00000000000000001",
    expected: 1,
  },
  {
    name: "negative zero",
    token: "-0",
    expected: -0,
  },
  {
    name: "underflow using normal JavaScript number precision",
    token: "1.2345678901234567e-400",
    expected: 0,
  },
];

for (const {
  name,
  token,
  expected,
} of numericCases) {
  test(`response parsing preserves the intended type for ${name}`, () => {
    const response = parseResponse(`{"value":${token}}`);
    assert.equal(response.value, expected);
    assert.equal(typeof response.value, typeof expected);
  });
}

test("mixed nested numbers preserve IDs, scores, and JSON serializability", () => {
  const response = parseResponse(`{
    "items": [{"person": {"id": 9223372036854775807}, "score": 0.12345678901234567}],
    "count": 9007199254740993,
    "total": 42,
    "metrics": [0.30000000000000004, 1e20, null, true]
  }`);
  assert.deepEqual(JSON.parse(JSON.stringify(response)), {
    items: [
      {
        person: {
          id: "9223372036854775807",
        },
        score: 0.12345678901234566,
      },
    ],
    count: "9007199254740993",
    total: 42,
    metrics: [
      0.30000000000000004,
      "100000000000000000000",
      null,
      true,
    ],
  });
});

test("quoted numeric strings and strings resembling BigNumber internals stay unchanged", () => {
  const raw = JSON.stringify({
    id: "9223372036854775807",
    score: "0.12345678901234567",
    exponent: "1e20",
    leadingZero: "00123",
    escaped: "A \"9223372036854775807\" value \\ 0.30000000000000004",
    toNumber: "0.30000000000000004",
    isInteger: true,
    _isBigNumber: true,
  });
  assert.deepEqual(JSON.parse(JSON.stringify(parseResponse(raw))), JSON.parse(raw));
});

test("account filtering retains fractional credits and numeric capabilities", () => {
  const response = parseResponse(`{
    "userId": "example-user",
    "apiKey": "synthetic-secret",
    "credits": {"used": 0.30000000000000004, "total": 100.00000000000001,
      "apiKey": "nested-synthetic-secret"},
    "capabilities": {"previews": true, "companySearchLimit": 1000}
  }`);
  const account = safeAccount(response);
  assert.deepEqual(account.credits, {
    used: 0.30000000000000004,
    total: 100.00000000000001,
  });
  assert.deepEqual(account.capabilities, {
    previews: true,
    companySearchLimit: 1000,
  });
  assert.equal(account.userId, "example-user");
  assert.equal(JSON.stringify(account).includes("synthetic-secret"), false);
});

test("response parsing continues to ignore prototype and constructor payloads", () => {
  const response = parseResponse(`{
    "__proto__": {"polluted": true},
    "constructor": {"prototype": {"polluted": true}},
    "score": 0.12345678901234567
  }`);
  assert.equal(Object.hasOwn(response, "__proto__"), false);
  assert.equal(Object.hasOwn(response, "constructor"), false);
  assert.equal(response.score, 0.12345678901234566);
  assert.equal({}.polluted, undefined);
});

test("malformed or non-finite JSON responses remain unchanged", () => {
  for (const raw of [
    "not JSON",
    "{\"id\":9223372036854775807,}",
    "{\"score\":NaN}",
    "{\"score\":1e400}",
    "",
  ]) {
    assert.equal(parseResponse(raw), raw);
  }
});

test("non-string response data passes through without coercion", () => {
  for (const value of [
    undefined,
    null,
    false,
    0,
    {},
    [],
  ]) {
    assert.equal(parseResponse(value), value);
  }
});

test("JSON scalar responses use the same numeric and string rules", () => {
  assert.equal(parseResponse("0.30000000000000004"), 0.30000000000000004);
  assert.equal(parseResponse("9223372036854775807"), "9223372036854775807");
  assert.equal(parseResponse("\"0.30000000000000004\""), "0.30000000000000004");
  assert.equal(parseResponse("true"), true);
  assert.equal(parseResponse("null"), null);
});
