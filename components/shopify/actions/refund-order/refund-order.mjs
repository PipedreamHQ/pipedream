import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-refund-order",
  name: "Refund Order",
  description:
    "Issue a refund for line items on a Shopify order."
    + " Requires line item GIDs — use **Search Orders** to find the order ID, then **Get Order Details** to retrieve line item GIDs from the `lineItems` array. **Search Orders** alone does NOT return line item GIDs."
    + " The `refundLineItems` param is a JSON array — each entry needs `lineItemId` (line item GID), `quantity`, and `restockType` (`CANCEL`, `NO_RESTOCK`, or `RETURN`)."
    + " Example: `[{\"lineItemId\": \"gid://shopify/LineItem/123\", \"quantity\": 1, \"restockType\": \"RETURN\"}]`"
    + " Returns the refund object including `id`, refunded amounts, and line item details."
    + " [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/refundcreate)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    shopify,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "Please verify that the Shopify shop has order data properly defined and that your API credentials have been granted the required access scopes. [See the documentation](https://shopify.dev/docs/apps/launch/protected-customer-data)",
    },
    orderId: {
      propDefinition: [
        shopify,
        "orderId",
      ],
      description: "The GID of the order to refund. Example: `gid://shopify/Order/123456789`. Accepts plain numeric IDs too. Use **Search Orders** then **Get Order Details** to find the order ID and its line item GIDs.",
    },
    refundLineItems: {
      type: "string",
      label: "Refund Line Items",
      description: "JSON array of line items to refund. Each must include `lineItemId`, `quantity`, and `restockType` (`CANCEL`, `NO_RESTOCK`, or `RETURN`). Optionally include `locationId`. Example: `[{\"lineItemId\": \"gid://shopify/LineItem/123\", \"quantity\": 1, \"restockType\": \"RETURN\"}]`",
    },
    note: {
      type: "string",
      label: "Note",
      description: "An optional note to attach to the refund",
      optional: true,
    },
  },
  async run({ $ }) {
    const raw = String(this.orderId).trim();
    const orderId = raw.startsWith("gid://shopify/Order/")
      ? raw
      : /^\d+$/.test(raw)
        ? `gid://shopify/Order/${raw}`
        : raw;

    const refundLineItems = JSON.parse(this.refundLineItems);
    const response = await this.shopify.refundOrder({
      input: {
        orderId,
        note: this.note,
        refundLineItems,
      },
    });
    if (response.refundCreate.userErrors.length > 0) {
      throw new Error(response.refundCreate.userErrors[0].message);
    }
    $.export("$summary", `Successfully refunded order \`${orderId}\``);
    return response.refundCreate.refund;
  },
};
