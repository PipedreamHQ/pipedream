import assert from "node:assert/strict";
import { test } from "node:test";
import action from "./submit-record-producer.mjs";

const PRODUCER_ID = "a".repeat(32);
const TARGET_ID = "b".repeat(32);

function exportProbe() {
  return {
    export() {},
  };
}

test("submits a producer with a reserved attachment target", async () => {
  const calls = [];
  const context = {
    ...action,
    catalogItemSysId: PRODUCER_ID,
    variables: {
      evidence: "c".repeat(32),
    },
    itemGuid: TARGET_ID,
    servicenow: {
      async submitRecordProducer(args) {
        calls.push(args);
        return {
          sys_id: TARGET_ID,
          table: "incident",
        };
      },
    },
  };

  const response = await action.run.call(context, {
    $: exportProbe(),
  });

  assert.equal(response.sys_id, TARGET_ID);
  assert.equal(calls[0].data.sysparm_item_guid, TARGET_ID);
});

test("fails closed when a producer ignores its reserved target", async () => {
  const context = {
    ...action,
    catalogItemSysId: PRODUCER_ID,
    variables: {},
    itemGuid: TARGET_ID,
    servicenow: {
      async submitRecordProducer() {
        return {
          sys_id: "c".repeat(32),
        };
      },
    },
  };

  await assert.rejects(
    action.run.call(context, {
      $: exportProbe(),
    }),
    /did not honor the reserved item GUID/,
  );
});
