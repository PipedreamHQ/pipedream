import assert from "node:assert/strict";
import test from "node:test";
import deepkeep from "../deepkeep.app.mjs";

test("normalizeModerationResult fails closed for unsupported-only guardrail actions", () => {
  const result = {
    flagged: true,
    verbosity: [
      {
        details: {
          guardrail_action: "quarantine",
        },
      },
    ],
  };

  const normalized = deepkeep.methods.normalizeModerationResult.call(
    deepkeep.methods,
    result,
    "hello",
  );

  assert.equal(normalized.allowed, false);
  assert.equal(normalized.blocked, true);
  assert.equal(normalized.action, "quarantine");
  assert.equal(normalized.processedText, "hello");
});
