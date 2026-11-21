import assert from "node:assert/strict";
import {
  describe,
  it,
} from "node:test";
import executeDecision from "../../actions/execute-decision/execute-decision.mjs";

function runAction(webhookUrl, execute) {
  return executeDecision.run.call({
    decisionId: "dec_test",
    webhookUrl,
    algenta: {
      executeDecision: execute,
    },
  }, {
    $: {
      export() {},
    },
  });
}

describe("Execute Decision webhook URL validation", () => {
  it("forwards an HTTPS webhook URL to the client", async () => {
    const receipt = {
      decision_id: "dec_test",
      execution_status: "delivered",
    };
    let receivedDecisionId;
    let receivedRequest;

    const result = await runAction(
      "https://ops.example.com/hooks/algenta",
      async (decisionId, request) => {
        receivedDecisionId = decisionId;
        receivedRequest = request;
        return receipt;
      },
    );

    assert.equal(receivedDecisionId, "dec_test");
    assert.deepEqual(receivedRequest, {
      webhook_url: "https://ops.example.com/hooks/algenta",
      timeout_seconds: undefined,
      metadata: undefined,
    });
    assert.equal(result, receipt);
  });

  for (const webhookUrl of [
    "not-a-url",
    "http://example.com/hooks/algenta",
    "http://localhost:9000/hooks/algenta",
    "ftp://example.com/hooks/algenta",
  ]) {
    it(`rejects ${webhookUrl} before calling the client`, async () => {
      let clientCalled = false;

      await assert.rejects(
        runAction(webhookUrl, async () => {
          clientCalled = true;
        }),
        /HTTPS Webhook URL/,
      );
      assert.equal(clientCalled, false);
    });
  }
});
