import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-cancel-fulfillment-order",
  name: "Cancel Fulfillment Order",
  description: "Cancels a fulfillment order. Run **Search for Orders** and inspect the order's fulfillment orders to obtain the fulfillment order GID. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/fulfillmentOrderCancel).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
  },
  props: {
    shopify,
    fulfillmentOrderId: {
      propDefinition: [
        shopify,
        "fulfillmentOrderId",
      ],
      description: "The fulfillment order GID to cancel, in the format `gid://shopify/FulfillmentOrder/555`. Obtain this from the **Search for Orders** action's fulfillment orders.",
    },
  },
  async run({ $ }) {
    const response = await this.shopify.cancelFulfillmentOrder({
      id: this.fulfillmentOrderId,
    });

    if (response.fulfillmentOrderCancel?.userErrors?.length > 0) {
      throw new Error(response.fulfillmentOrderCancel.userErrors.map(({ message }) => message).join(", "));
    }

    const { fulfillmentOrder } = response.fulfillmentOrderCancel ?? {};
    $.export("$summary", `Cancelled fulfillment order \`${fulfillmentOrder?.id}\` - status: \`${fulfillmentOrder?.status}\``);
    return response;
  },
};
