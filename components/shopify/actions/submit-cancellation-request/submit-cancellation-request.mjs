import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-submit-cancellation-request",
  name: "Submit Cancellation Request",
  description: "Request cancellation of a fulfillment order. This is a fulfillment-service workflow distinct from cancelling the order itself. Run **Get Fulfillment Orders** first to obtain the fulfillment order GID. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/fulfillmentOrderSubmitCancellationRequest)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    shopify,
    fulfillmentOrderId: {
      type: "string",
      label: "Fulfillment Order ID",
      description: "The GID of the fulfillment order to request cancellation for, e.g. `gid://shopify/FulfillmentOrder/1234567890`. Run **Get Fulfillment Orders** first to find the fulfillment order ID.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "An optional message for the fulfillment service explaining the cancellation request.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.shopify.submitFulfillmentOrderCancellationRequest({
      id: this.fulfillmentOrderId,
      message: this.message,
    });

    if (response.fulfillmentOrderSubmitCancellationRequest.userErrors?.length) {
      throw new Error(response.fulfillmentOrderSubmitCancellationRequest.userErrors.map(({ message }) => message).join(", "));
    }

    $.export("$summary", `Successfully submitted cancellation request for fulfillment order ${this.fulfillmentOrderId}`);
    return response;
  },
};
