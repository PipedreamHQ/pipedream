import assert from "node:assert/strict";
import { test } from "node:test";
import servicenow from "../../servicenow.app.mjs";
import action from "./update-cart-item.mjs";

const CART_ITEM_ID = "a".repeat(32);
const ATTACHMENT_ID = "b".repeat(32);

function exportProbe() {
  const calls = [];
  return {
    export(...args) {
      calls.push(args);
    },
    calls,
  };
}

test("uses the Service Catalog update-cart endpoint", async () => {
  const requestCalls = [];
  const context = {
    ...servicenow.methods,
    _instanceBaseUrl() {
      return "https://example.service-now.com";
    },
    async _makeRequest(args) {
      requestCalls.push(args);
      return {
        cart_id: "default",
      };
    },
  };

  await servicenow.methods.updateCartItem.call(context, {
    cartItemId: CART_ITEM_ID,
    data: {
      sysparm_quantity: 1,
      variables: {
        evidence: ATTACHMENT_ID,
      },
    },
  });

  assert.deepEqual(requestCalls, [
    {
      method: "put",
      baseURL: "https://example.service-now.com/api/sn_sc/servicecatalog",
      url: `/cart/${CART_ITEM_ID}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        sysparm_quantity: 1,
        variables: {
          evidence: ATTACHMENT_ID,
        },
      },
    },
  ]);
});

test("writes attachment sys_ids into cart variables", async () => {
  const calls = [];
  const $ = exportProbe();
  const context = {
    ...action,
    cartItemId: CART_ITEM_ID,
    quantity: 1,
    requestedFor: "c".repeat(32),
    variables: {
      evidence: ATTACHMENT_ID,
    },
    servicenow: {
      async updateCartItem(args) {
        calls.push(args);
        return {
          cart_id: "default",
        };
      },
    },
  };

  const response = await action.run.call(context, {
    $,
  });

  assert.equal(response.cart_item_id, CART_ITEM_ID);
  assert.deepEqual(calls[0].data, {
    sysparm_quantity: 1,
    variables: {
      evidence: ATTACHMENT_ID,
    },
    sysparm_requested_for: "c".repeat(32),
  });
  assert.deepEqual($.calls, [
    [
      "$summary",
      `Successfully updated cart item ${CART_ITEM_ID}`,
    ],
  ]);
});

test("rejects an invalid cart item id before writing", async () => {
  const calls = [];
  const context = {
    ...action,
    cartItemId: "not-a-sys-id",
    quantity: 1,
    variables: {},
    servicenow: {
      async updateCartItem(args) {
        calls.push(args);
      },
    },
  };

  await assert.rejects(
    action.run.call(context, {
      $: exportProbe(),
    }),
    /32-character hexadecimal/,
  );
  assert.deepEqual(calls, []);
});
