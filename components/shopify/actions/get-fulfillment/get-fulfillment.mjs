import shopify from "../../shopify.app.mjs";
import { MAX_LIMIT } from "../../common/constants.mjs";

export default {
  key: "shopify-get-fulfillment",
  name: "Get Fulfillment",
  description: "Retrieve a fulfillment, including tracking info, status, and delivery timestamps. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/fulfillment)",
  version: "0.0.3",
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
      content: "Please verify that the Shopify shop has fulfillments properly defined and that your API credentials have been granted this access scope. [See the documentation](https://shopify.dev/docs/api/usage/access-scopes)",
    },
    orderId: {
      propDefinition: [
        shopify,
        "orderId",
      ],
      optional: true,
    },
    fulfillmentId: {
      propDefinition: [
        shopify,
        "fulfillmentId",
        ({ orderId }) => ({
          orderId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { fulfillment } = await this.shopify.getFulfillment({
      id: this.fulfillmentId,
      first: MAX_LIMIT,
    });
    if (!fulfillment) {
      throw new Error(`No fulfillment found for fulfillment ID: ${this.fulfillmentId}`);
    }
    $.export("$summary", `Successfully retrieved fulfillment \`${fulfillment.id}\``);
    return fulfillment;
  },
};
