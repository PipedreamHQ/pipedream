import { ConfigurationError } from "@pipedream/platform";
import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-create-refund",
  name: "Create Refund",
  description: "Create a refund on an existing order. Run **Search for Orders** first to obtain the order GID and the line item GIDs to refund. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/refundCreate)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    shopify,
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The GID of the order to refund, e.g. `gid://shopify/Order/820982911946154508`. Run **Search for Orders** first to find the order ID.",
    },
    refundLineItems: {
      type: "string",
      label: "Refund Line Items",
      description: "Optional JSON array of line items to refund. Each object: `lineItemId` (GID, required), `quantity` (int, required), `restockType` (one of `CANCEL`, `NO_RESTOCK`, `RETURN`), `locationId` (GID, omit when `NO_RESTOCK`). Example: `[{\"lineItemId\":\"gid://shopify/LineItem/866550311766439020\",\"quantity\":1,\"restockType\":\"RETURN\"}]`. Run **Search for Orders** to find line item GIDs.",
      optional: true,
    },
    notify: {
      type: "boolean",
      label: "Notify Customer",
      description: "Whether to send a refund notification to the customer.",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "An optional note attached to the refund.",
      optional: true,
    },
  },
  async run({ $ }) {
    let refundLineItems;
    if (this.refundLineItems) {
      try {
        refundLineItems = JSON.parse(this.refundLineItems);
      } catch {
        throw new ConfigurationError("**Refund Line Items** must be a valid JSON array, e.g. `[{\"lineItemId\":\"gid://shopify/LineItem/866550311766439020\",\"quantity\":1,\"restockType\":\"RETURN\"}]`");
      }
      if (!Array.isArray(refundLineItems)) {
        throw new ConfigurationError("**Refund Line Items** must be a valid JSON array, e.g. `[{\"lineItemId\":\"gid://shopify/LineItem/866550311766439020\",\"quantity\":1,\"restockType\":\"RETURN\"}]`");
      }
    }

    const input = {
      orderId: this.orderId,
      notify: this.notify,
      note: this.note,
      refundLineItems,
    };

    const response = await this.shopify.createRefund({
      input,
    });

    if (response.refundCreate.userErrors?.length) {
      throw new Error(response.refundCreate.userErrors.map(({ message }) => message).join(", "));
    }

    $.export("$summary", `Successfully created refund ${response.refundCreate.refund.id} on order ${this.orderId}`);
    return response;
  },
};
