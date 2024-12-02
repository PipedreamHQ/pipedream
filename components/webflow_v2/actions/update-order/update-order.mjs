import app from "../../webflow_v2.app.mjs";

export default {
  key: "webflow_v2-update-order",
  name: "Update Order",
  description: "Update an order. [See the docs here](https://developers.webflow.com/#update-order)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    siteId: {
      propDefinition: [
        app,
        "sites",
      ],
    },
    orderId: {
      propDefinition: [
        app,
        "orders",
      ],
    },
    comment: {
      label: "Comment",
      description: "Arbitrary data for your records.",
      type: "string",
      optional: true,
    },
    shippingProvider: {
      label: "Shipping Provider",
      description: "Company or method used to ship order.",
      type: "string",
      optional: true,
    },
    shippingTracking: {
      label: "Shipping Tracking",
      description: "Tracking number for order shipment.",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app, siteId, orderId, ...data
    } = this;

    const response = await app.updateOrder(siteId, orderId, data);

    $.export("$summary", "Successfully updated order");

    return response;
  },
};
