import assert from "node:assert/strict";
import { test } from "node:test";
import { catalogCartItems } from "../../common/utils.mjs";
import action from "./add-item-to-cart.mjs";

const CATALOG_ITEM_ID = "a".repeat(32);
const ITEM_GUID = "b".repeat(32);

function exportProbe() {
  const calls = [];
  return {
    export(...args) {
      calls.push(args);
    },
    calls,
  };
}

test("finds cart item identities in ServiceNow recurring-price groups", () => {
  assert.deepEqual(
    catalogCartItems({
      none: {
        items: [
          {
            cart_item_id: ITEM_GUID,
            catalog_item_id: CATALOG_ITEM_ID,
          },
        ],
      },
    }),
    [
      {
        cartItemId: ITEM_GUID,
        catalogItemId: CATALOG_ITEM_ID,
      },
    ],
  );
});

test("reserves and verifies an attachment staging cart item", async () => {
  const addCalls = [];
  const context = {
    ...action,
    catalogItemSysId: CATALOG_ITEM_ID,
    quantity: 1,
    variables: {
      requested_for: "c".repeat(32),
    },
    requestedFor: "c".repeat(32),
    itemGuid: ITEM_GUID,
    servicenow: {
      async addItemToCart(args) {
        addCalls.push(args);
        return {
          cart_id: "default",
        };
      },
      async getCart() {
        return {
          none: {
            items: [
              {
                cart_item_id: ITEM_GUID,
                catalog_item_id: CATALOG_ITEM_ID,
              },
            ],
          },
        };
      },
    },
  };

  const response = await action.run.call(context, {
    $: exportProbe(),
  });

  assert.equal(response.cart_item_id, ITEM_GUID);
  assert.equal(addCalls[0].data.sysparm_item_guid, ITEM_GUID);
});

test("returns the actual cart item created when no reserved guid is requested", async () => {
  const actualCartItemId = "d".repeat(32);
  const context = {
    ...action,
    catalogItemSysId: CATALOG_ITEM_ID,
    quantity: 1,
    variables: {},
    requestedFor: "c".repeat(32),
    servicenow: {
      async addItemToCart() {
        return {
          cart_id: "default",
          items: [
            {
              cart_item_id: actualCartItemId,
              catalog_item_id: CATALOG_ITEM_ID,
            },
          ],
        };
      },
    },
  };

  const response = await action.run.call(context, {
    $: exportProbe(),
  });

  assert.equal(response.cart_item_id, actualCartItemId);
});

test("fails closed when ServiceNow ignores the reserved item GUID", async () => {
  const context = {
    ...action,
    catalogItemSysId: CATALOG_ITEM_ID,
    quantity: 1,
    variables: {},
    itemGuid: ITEM_GUID,
    servicenow: {
      async addItemToCart() {
        return {};
      },
      async getCart() {
        return {
          none: {
            items: [
              {
                cart_item_id: "c".repeat(32),
                catalog_item_id: CATALOG_ITEM_ID,
              },
            ],
          },
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
