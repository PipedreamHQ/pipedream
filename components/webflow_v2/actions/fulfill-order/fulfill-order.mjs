import app from "../../webflow_v2.app.mjs";

export default {
  key: "webflow_v2-fulfill-order",
  name: "Fulfill Order",
  description: "Fulfill an order. [See the docs here](https://developers.webflow.com/#fulfill-order)",
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
