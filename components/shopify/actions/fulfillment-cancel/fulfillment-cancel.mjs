import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-fulfillment-cancel",
  name: "Cancel Fulfillment",
  description: "Cancels an existing fulfillment and reverses its effects on associated fulfillment orders. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/fulfillmentCancel)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shopify,
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
    const { fulfillmentCancel } = await this.shopify.cancelFulfillment({
      id: this.fulfillmentId,
    });

    if (fulfillmentCancel.userErrors?.length) {
      throw new Error(fulfillmentCancel.userErrors.map((e) => e.message).join(", "));
    }

    $.export("$summary", `Successfully cancelled fulfillment \`${fulfillmentCancel.fulfillment.id}\``);
    return fulfillmentCancel.fulfillment;
  },
};
