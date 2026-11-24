// Unit tests for Check Delegated Item Access, with stubbed ServiceNow calls. Run from the
// repository root:
// node --test components/servicenow/common/check-delegated-item-access.test.mjs
import assert from "node:assert/strict";
import test from "node:test";
import action from "../actions/check-delegated-item-access/check-delegated-item-access.mjs";

const id = (c) => c.repeat(32);
const U = id("a");

const requestError = (status, code) => Object.assign(new Error(status
  ? `HTTP ${status}`
  : code), {
  isAxiosError: true,
  code,
  response: status
    ? {
      status,
    }
    : undefined,
});

const activeRecipient = (user) => ({
  sys_id: user,
  active: "true",
});

// Runs the action with `answer(itemSysId, userSysId)` standing in for the delegation endpoint and
// `recipient(userSysId)` for the recipient's sys_user record.
async function run(itemIds, answer, userSysId = U, recipient = activeRecipient) {
  const calls = [];
  const summary = {};
  const self = {
    ...action.methods,
    userSysId,
    catalogItemSysIds: itemIds,
    servicenow: {
      async getTableRecordById({
        table, recordId,
      }) {
        assert.equal(table, "sys_user");
        return recipient(recordId);
      },
      async checkDelegatedItemAccess({
        catalogItemSysId, userSysId: user,
      }) {
        calls.push([
          catalogItemSysId,
          user,
        ]);
        return answer(catalogItemSysId, user);
      },
    },
  };
  const result = await action.run.call(self, {
    $: {
      export: (key, value) => {
        summary[key] = value;
      },
    },
  });
  return {
    result,
    calls,
    summary: summary.$summary,
  };
}

test("maps ServiceNow's answer for each item, in input order", async () => {
  const { result } = await run([
    id("1"),
    id("2"),
  ], (item) => (item === id("1")
    ? {
      result: true,
    }
    : {
      result: false,
      errMsg: "Item is unavailable for this user",
    }));
  assert.deepEqual(result, [
    {
      sys_id: id("1"),
      can_request: true,
      reason: "delegation_allowed",
    },
    {
      sys_id: id("2"),
      can_request: false,
      reason: "delegation_denied",
    },
  ]);
});

test("a 400 (ServiceNow refuses delegation on the item) is item_unavailable", async () => {
  const { result } = await run([
    id("1"),
  ], () => {
    throw requestError(400);
  });
  assert.deepEqual(result[0], {
    sys_id: id("1"),
    can_request: false,
    reason: "item_unavailable",
  });
});

test("an inactive or unknown recipient is refused without asking about any item", async () => {
  const never = () => assert.fail("delegation was checked");
  const inactive = await run([
    id("1"),
    id("2"),
  ], never, U, (user) => ({
    sys_id: user,
    active: "false",
  }));
  assert.ok(inactive.result.every((row) => row.can_request === false && row.reason === "recipient_inactive"));
  assert.equal(inactive.summary, `0 of 2 catalog item(s) may be requested for user ${U} (recipient_inactive)`);
  const missing = await run([
    id("1"),
  ], never, U, () => {
    throw requestError(404);
  });
  assert.deepEqual(missing.result[0], {
    sys_id: id("1"),
    can_request: false,
    reason: "recipient_not_found",
  });
});

test("only an explicit active value decides the recipient; a hidden one is undetermined", async () => {
  const answer = () => ({
    result: true,
  });
  for (const [
    active,
    expected,
  ] of [
      [
        true,
        "true/delegation_allowed",
      ],
      [
        "true",
        "true/delegation_allowed",
      ],
      [
        false,
        "false/recipient_inactive",
      ],
      [
        "false",
        "false/recipient_inactive",
      ],
      [
        undefined,
        "null/check_failed",
      ],
      [
        "",
        "null/check_failed",
      ],
      [
        "yes",
        "null/check_failed",
      ],
    ]) {
    const { result } = await run([
      id("1"),
    ], answer, U, (user) => (active === undefined
      ? {
        sys_id: user,
      }
      : {
        sys_id: user,
        active,
      }));
    assert.equal(`${result[0].can_request}/${result[0].reason}`, expected, `active=${JSON.stringify(active)}`);
  }
});

test("after a broken connection no further items are checked", async () => {
  const items = Array.from({
    length: 50,
  }, (_, i) => i.toString(16).padStart(32, "0"));
  let calls = 0;
  await assert.rejects(run(items, (item) => {
    calls++;
    if (item === items[0]) throw requestError(401);
    return {
      result: true,
    };
  }), /HTTP 401/);
  assert.ok(calls <= 5, `${calls} delegation calls after the 401`);
});

test("a recipient lookup that fails leaves every item undetermined", async () => {
  const never = () => assert.fail("delegation was checked");
  for (const [
    lookup,
    reason,
  ] of [
      [
        () => {
          throw requestError(403);
        },
        "unreadable",
      ],
      [
        () => {
          throw requestError(500);
        },
        "check_failed",
      ],
      [
        () => null,
        "check_failed",
      ],
    ]) {
    const { result } = await run([
      id("1"),
    ], never, U, lookup);
    assert.deepEqual(result[0], {
      sys_id: id("1"),
      can_request: null,
      reason,
    });
  }
});

test("upper-case sys_ids are accepted and lowercased", async () => {
  const { calls } = await run([
    id("B"),
    id("b"),
  ], () => ({
    result: true,
  }), id("A"));
  assert.deepEqual(calls, [
    [
      id("b"),
      U,
    ],
  ]);
});

test("asks about the recipient once per distinct item", async () => {
  const { calls } = await run([
    id("1"),
    ` ${id("1")} `,
    id("2"),
  ], () => ({
    result: true,
  }));
  assert.deepEqual(calls.map(([
    item,
  ]) => item).sort(), [
    id("1"),
    id("2"),
  ]);
  assert.ok(calls.every(([
    , user,
  ]) => user === U));
});

test("a 403 is unreadable and any other request error check_failed, per item", async () => {
  const { result } = await run([
    id("1"),
    id("2"),
    id("3"),
  ], (item) => {
    if (item === id("1")) throw requestError(403);
    if (item === id("2")) throw requestError(500);
    throw requestError(undefined, "ETIMEDOUT");
  });
  assert.deepEqual(result.map(({
    can_request, reason,
  }) => [
    can_request,
    reason,
  ]), [
    [
      null,
      "unreadable",
    ],
    [
      null,
      "check_failed",
    ],
    [
      null,
      "check_failed",
    ],
  ]);
});

test("a response without a boolean is check_failed, never allowed", async () => {
  const { result } = await run([
    id("1"),
    id("2"),
  ], (item) => (item === id("1")
    ? {
      result: "true",
    }
    : true));
  assert.ok(result.every((row) => row.can_request === null && row.reason === "check_failed"));
});

test("a broken connection (401) or a bug fails the whole action", async () => {
  await assert.rejects(run([
    id("1"),
  ], () => {
    throw requestError(401);
  }), /HTTP 401/);
  await assert.rejects(run([
    id("1"),
  ], () => {
    throw new TypeError("bug");
  }), /bug/);
});

test("rejects missing, too many, or malformed sys_ids before calling ServiceNow", async () => {
  const answer = () => assert.fail("ServiceNow was called");
  await assert.rejects(run([], answer), /1-50/);
  await assert.rejects(run(Array.from({
    length: 51,
  }, (_, i) => i.toString(16).padStart(32, "0")), answer), /1-50/);
  await assert.rejects(run([
    "not-a-sys-id",
  ], answer), /32-character/);
  await assert.rejects(run([
    id("1"),
  ], answer, "KB0001"), /32-character/);
});

test("the summary counts allowed and undetermined items", async () => {
  const { summary } = await run([
    id("1"),
    id("2"),
    id("3"),
  ], (item) => {
    if (item === id("3")) throw requestError(500);
    return {
      result: item === id("1"),
    };
  });
  assert.equal(summary, `1 of 3 catalog item(s) may be requested for user ${U}; 1 could not be determined`);
});
