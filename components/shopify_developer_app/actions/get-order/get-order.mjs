import { MAX_LIMIT } from "@pipedream/shopify/common/constants.mjs";
import shopify from "../../shopify_developer_app.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "shopify_developer_app-get-order",
  name: "Get Order",
  description: "Retrieve an order by specifying the order ID. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/order)",
  version: "0.0.11",
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
  methods: {
    validateOrderId(orderId) {
      const prefix = "gid://shopify/Order/";
      const value = String(orderId).trim();
      if (value.startsWith(prefix)) {
        return value;
      }
      if (/^\d+$/.test(value)) {
        return `${prefix}${value}`;
      }
      throw new ConfigurationError(`Invalid order ID: ${orderId}`);
    },
  },
  async run({ $ }) {
    const orderId = this.validateOrderId(this.orderId);

    const response = await this.shopify.getOrder({
      id: orderId,
      first: MAX_LIMIT,
    });
    $.export("$summary", `Successfully retrieved order with ID: ${orderId}`);
    return response;
  },
};
