import app from "../../webflow.app.mjs";

export default {
  key: "webflow-refund-order",
  name: "Refund Order",
  description: "Refund an order. [See the docs here](https://developers.webflow.com/#refund-order)",
  version: "1.0.0",
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
  },
  async run({ $ }) {
    const response = await this.app.refundOrder(this.siteId, this.orderId);

    $.export("$summary", "Successfully refunded order");

    return response;
  },
};
