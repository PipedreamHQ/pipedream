import { ConfigurationError } from "@pipedream/platform";
import shopify from "../../shopify.app.mjs";
import { ORDER_CREATE_INVENTORY_BEHAVIORS } from "../../common/constants.mjs";

export default {
  key: "shopify-create-order",
  name: "Create Order",
  description: "Creates a new order. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/orderCreate).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    shopify,
    lineItems: {
      type: "string",
      label: "Line Items",
      description: "JSON array of line items for the order. Each item accepts `variantId` (GID) and `quantity`, plus optional `title`, `priceSet`, and `taxLines`. Example: `[{\"variantId\": \"gid://shopify/ProductVariant/123456789\", \"quantity\": 1}]`. Retrieve variant GIDs via the **Search for Product Variant** action.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Customer email for the order (e.g. `customer@example.com`).",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "ISO 4217 currency code for the order (e.g. `USD`).",
      optional: true,
    },
    tags: {
      type: "string",
      label: "Tags",
      description: "Comma-separated tags to apply to the order (e.g. `vip,priority`).",
      optional: true,
    },
    inventoryBehaviour: {
      type: "string",
      label: "Inventory Behaviour",
      description: "How inventory is claimed for the order. One of `BYPASS` (do not claim inventory), `DECREMENT_IGNORING_POLICY` (claim inventory, ignoring the variant's inventory policy), or `DECREMENT_OBEYING_POLICY` (claim inventory, obeying the variant's inventory policy). Defaults to `BYPASS`.",
      options: ORDER_CREATE_INVENTORY_BEHAVIORS,
      optional: true,
      default: "BYPASS",
    },
    sendReceipt: {
      type: "boolean",
      label: "Send Receipt",
      description: "Whether to send an order confirmation to the customer.",
      optional: true,
    },
    sendFulfillmentReceipt: {
      type: "boolean",
      label: "Send Fulfillment Receipt",
      description: "Whether to send a shipping confirmation to the customer.",
      optional: true,
    },
    additionalOrderFields: {
      type: "object",
      label: "Additional Order Fields",
      description: "JSON object of additional fields (e.g. `customer`, `billingAddress`, `shippingAddress`, `transactions`, `note`). Example: `{\"note\": \"Rush order\"}`.",
      optional: true,
    },
  },
  async run({ $ }) {
    let lineItems;
    try {
      lineItems = JSON.parse(this.lineItems);
    } catch (err) {
      throw new ConfigurationError("`Line Items` must be valid JSON. " + err.message);
    }
    const tags = this.tags
      ? this.tags.split(",").map((t) => t.trim())
      : undefined;

    const order = {
      ...(this.additionalOrderFields || {}),
      lineItems,
      email: this.email,
      currency: this.currency,
      tags,
    };

    const response = await this.shopify.createOrder({
      order,
      options: {
        inventoryBehaviour: this.inventoryBehaviour,
        sendReceipt: this.sendReceipt,
        sendFulfillmentReceipt: this.sendFulfillmentReceipt,
      },
    });

    if (response.orderCreate?.userErrors?.length > 0) {
      throw new Error(response.orderCreate.userErrors.map(({ message }) => message).join(", "));
    }

    const { order: createdOrder } = response.orderCreate ?? {};
    $.export("$summary", `Created order \`${createdOrder?.name}\` with id \`${createdOrder?.id}\``);
    return response;
  },
};
