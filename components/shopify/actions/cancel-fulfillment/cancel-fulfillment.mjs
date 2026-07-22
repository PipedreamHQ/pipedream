import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-cancel-fulfillment",
  name: "Cancel Fulfillment",
  description: "Cancels a fulfillment. Run the **Search for Orders** action and inspect the order's fulfillments to obtain the fulfillment GID. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/fulfillmentCancel).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
  },
  props: {
    shopify,
    orderId: {
      propDefinition: [
        shopify,
        "orderId",
      ],
      optional: true,
      description: "When an order GID is provided, the available fulfillments are scoped to that order's fulfillments. Retrieve order GIDs via the **Search for Orders** action.",
    },
    fulfillmentId: {
      propDefinition: [
        shopify,
        "fulfillmentId",
        ({ orderId }) => ({
          orderId,
        }),
      ],
      description: "The fulfillment GID to cancel, in the format `gid://shopify/Fulfillment/444`. Obtain it from the order's fulfillments via the **Search for Orders** action. If an Order ID is provided, the available fulfillments are scoped to that order.",
    },
  },
  async run({ $ }) {
    const response = await this.shopify.cancelFulfillment({
      id: this.fulfillmentId,
    });

    if (response.fulfillmentCancel?.userErrors?.length > 0) {
      throw new Error(response.fulfillmentCancel.userErrors.map(({ message }) => message).join(", "));
    }

    const { fulfillment } = response.fulfillmentCancel ?? {};
    $.export("$summary", `Cancelled fulfillment \`${fulfillment?.id}\` - status: \`${fulfillment?.status}\``);
    return response;
  },
};
