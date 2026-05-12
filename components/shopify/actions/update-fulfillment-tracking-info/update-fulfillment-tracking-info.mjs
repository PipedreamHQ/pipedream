import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-update-fulfillment-tracking-info",
  name: "Update Fulfillment Tracking Info",
  description:
    "Update the tracking information for a fulfillment in Shopify."
    + " Use when you have a tracking number or URL to add to a fulfilled shipment."
    + " Requires a fulfillment GID — use **Search Orders** to find the order, then **Get Order Details** to retrieve fulfillment GIDs from the `fulfillments` array. **Search Orders** alone does NOT return fulfillment GIDs."
    + " Fulfillment GIDs are in the format: `gid://shopify/Fulfillment/123456789`."
    + " Returns the updated fulfillment object including `id`, `status`, and `trackingInfo`."
    + " [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/fulfillmenttrackinginfoupdate)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    shopify,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "Fulfillment actions require one of the following access scopes: `write_assigned_fulfillment_orders`, `write_merchant_managed_fulfillment_orders`, or `write_third_party_fulfillment_orders`. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/objects/fulfillmentorder#api-access-scopes)",
    },
    fulfillmentId: {
      type: "string",
      label: "Fulfillment ID",
      description: "The GID of the fulfillment to update. Example: `gid://shopify/Fulfillment/123456789`. Use **Get Order Details** to find fulfillment GIDs within an order's `fulfillments` array.",
    },
    company: {
      type: "string",
      label: "Tracking Company",
      description: "The name of the shipping carrier. Example: `UPS`, `FedEx`, `USPS`",
      optional: true,
    },
    number: {
      type: "string",
      label: "Tracking Number",
      description: "The tracking number for the shipment",
      optional: true,
    },
    url: {
      type: "string",
      label: "Tracking URL",
      description: "A URL where the customer can track the shipment",
      optional: true,
    },
    notifyCustomer: {
      type: "boolean",
      label: "Notify Customer",
      description: "Whether to send a tracking update notification to the customer",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.shopify.updateFulfillmentTrackingInfo({
      fulfillmentId: this.fulfillmentId,
      trackingInfoInput: {
        company: this.company,
        number: this.number,
        url: this.url,
      },
      notifyCustomer: this.notifyCustomer,
    });
    if (response.fulfillmentTrackingInfoUpdate.userErrors.length > 0) {
      throw new Error(response.fulfillmentTrackingInfoUpdate.userErrors[0].message);
    }
    $.export("$summary", `Successfully updated tracking info for fulfillment \`${this.fulfillmentId}\``);
    return response.fulfillmentTrackingInfoUpdate.fulfillment;
  },
};
