import shopify from "../../shopify_developer_app.app.mjs";

export default {
  key: "shopify_developer_app-update-fulfillment-tracking-info",
  name: "Update Fulfillment Tracking Info",
  description: "Update the tracking info for a fulfillment. [See the documentation](https://shopify.dev/docs/api/admin-graphql/unstable/mutations/fulfillmenttrackinginfoupdate)",
  version: "0.0.2",
  type: "action",
  props: {
    shopify,
    orderId: {
      propDefinition: [
        shopify,
        "orderId",
      ],
    },
    fulfillmentId: {
      propDefinition: [
        shopify,
        "fulfillmentId",
        (c) => ({
          orderId: c.orderId,
        }),
      ],
    },
    company: {
      type: "string",
      label: "Company",
      description: "The name of the tracking company",
      optional: true,
    },
    number: {
      type: "string",
      label: "Tracking Number",
      description: "The tracking number for the fulfillment",
      optional: true,
    },
    url: {
      type: "string",
      label: "Tracking URL",
      description: "The URL for the tracking information",
      optional: true,
    },
    notifyCustomer: {
      type: "boolean",
      label: "Notify Customer",
      description: "Whether to notify the customer",
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
    $.export("$summary", `Updated fulfillment tracking info for fulfillment with ID: ${this.fulfillmentId}`);
    return response;
  },
};
