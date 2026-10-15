import assert from "node:assert/strict";
import { test } from "node:test";
import action from "./submit-order-guide.mjs";

const GUIDE_ID = "a".repeat(32);
const ITEM_ID = "b".repeat(32);
const CART_ITEM_ID = "c".repeat(32);

test("returns the cart item identity for each guide child", async () => {
  const context = {
    ...action,
    catalogItemSysId: GUIDE_ID,
    variables: {
      requested_for: "d".repeat(32),
    },
    servicenow: {
      async submitOrderGuide() {
        return [
          {
            sys_id: ITEM_ID,
            quantity: "1",
            variables: [],
          },
        ];
      },
      async getCart() {
        return {
          cart_id: "default",
          none: {
            items: [
              {
                cart_item_id: CART_ITEM_ID,
                catalog_item_id: ITEM_ID,
              },
            ],
          },
        };
      },
    },
  };
  const summaries = [];

  const response = await action.run.call(context, {
    $: {
      export(...args) {
        summaries.push(args);
      },
    },
  });

  assert.equal(response.items[0].cart_item_id, CART_ITEM_ID);
  assert.equal(response.cart_id, "default");
  assert.equal(summaries.length, 1);
});
