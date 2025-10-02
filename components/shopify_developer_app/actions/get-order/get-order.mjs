import { MAX_LIMIT } from "@pipedream/shopify/common/constants.mjs";
import shopify from "../../shopify_developer_app.app.mjs";

export default {
  key: "shopify_developer_app-get-order",
  name: "Get Order",
  description: "Retrieve an order by specifying the order ID. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/order)",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    shopify,
    orderId: {
      propDefinition: [
        shopify,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.shopify.getOrder({
      id: this.orderId,
      first: MAX_LIMIT,
    });
    $.export("$summary", `Successfully retrieved order with ID: ${this.orderId}`);
    return response;
  },
};
