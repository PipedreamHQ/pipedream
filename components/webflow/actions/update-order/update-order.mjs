import app from "../../webflow.app.mjs";

export default {
  key: "webflow-update-order",
  name: "Update Order",
  description: "Update an order. [See the documentation](https://developers.webflow.com/data/reference/ecommerce/orders/update)",
  version: "2.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
