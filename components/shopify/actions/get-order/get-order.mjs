import { MAX_LIMIT } from "../../common/constants.mjs";
import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-get-order",
  name: "Get Order Details",
  description:
    "Retrieve the complete details of a single Shopify order by ID — line items with GIDs, fulfillments with GIDs, and customer info."
    + " **Search Orders** returns summary data only and does NOT include line item GIDs or fulfillment GIDs."
    + " Use this tool after **Search Orders** whenever you need to: refund items (**Refund Order** requires line item GIDs from `lineItems`), update tracking (**Update Fulfillment Tracking Info** requires fulfillment GIDs from `fulfillments`), or inspect the complete order."
    + " Accepts both numeric IDs (e.g. `12345`) and GID format (e.g. `gid://shopify/Order/12345`)."
    + " Returns the order object including `id`, `name`, `lineItems` (each with GID), `fulfillments` (each with GID), `customer`, and `financialStatus`."
    + " [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/order)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
      description: "The ID of the order to retrieve. Accepts a GID (`gid://shopify/Order/123`) or a plain numeric ID (`123`). Use **Search Orders** to find order IDs.",
    },
  },
  async run({ $ }) {
    const raw = String(this.orderId).trim();
    const orderId = raw.startsWith("gid://shopify/Order/")
      ? raw
      : /^\d+$/.test(raw)
        ? `gid://shopify/Order/${raw}`
        : raw;

    const response = await this.shopify.getOrder({
      id: orderId,
      first: MAX_LIMIT,
    });
    $.export("$summary", `Successfully retrieved order \`${response.order?.name ?? orderId}\``);
    return response.order;
  },
};
