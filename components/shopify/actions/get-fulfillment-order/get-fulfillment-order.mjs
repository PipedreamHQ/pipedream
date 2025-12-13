import shopify from "../../shopify.app.mjs";
import { MAX_LIMIT } from "../../common/constants.mjs";

export default {
  key: "shopify-get-fulfillment-order",
  name: "Get Fulfillment Order",
  description: "Retrieve a single fulfillment order by ID. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/fulfillmentorder)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    shopify,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "Please verify that the Shopify shop has fulfillment orders properly defined and that your API credentials have been granted this access scope. [See the documentation](https://shopify.dev/docs/admin-api/access-scopes)",
    },
    fulfillmentOrderId: {
      propDefinition: [
        shopify,
        "fulfillmentOrderId",
      ],
    },
  },
  async run({ $ }) {
    const { fulfillmentOrder } = await this.shopify.getFulfillmentOrder({
      id: this.fulfillmentOrderId,
      first: MAX_LIMIT,
    });
    $.export("$summary", `Successfully retrieved fulfillment order \`${fulfillmentOrder.id}\``);
    return fulfillmentOrder;
  },
};
