import { ConfigurationError } from "@pipedream/platform";
import shopify from "../../shopify.app.mjs";

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
    });

    if (response.orderCreate?.userErrors?.length > 0) {
      throw new Error(response.orderCreate.userErrors[0].message);
    }

    const { order: createdOrder } = response.orderCreate ?? {};
    $.export("$summary", `Created order \`${createdOrder?.name}\` with id \`${createdOrder?.id}\``);
    return response;
  },
};
