import app from "../../webflow.app.mjs";

export default {
  key: "webflow-fulfill-order",
  name: "Fulfill Order",
  description: "Fulfill an order. [See the documentation](https://developers.webflow.com/data/reference/ecommerce/orders/update-fulfill)",
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
    sendOrderFulfilledEmail: {
      label: "Send Order Fulfilled Email",
      description: "Whether or not the Order Fulfilled email should be sent",
      type: "boolean",
      default: false,
    },
  },
  async run({ $ }) {
    const {
      app, siteId, orderId, ...data
    } = this;
    const response = await app.fulfillOrder(siteId, orderId, data);

    $.export("$summary", "Successfully fulfilled order");

    return response;
  },
};
