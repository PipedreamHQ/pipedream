import app from "../../webflow_v2.app.mjs";

export default {
  key: "webflow_v2-refund-order",
  name: "Refund Order",
  description: "Refund an order. [See the docs here](https://developers.webflow.com/#refund-order)",
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
  },
  async run({ $ }) {
    const response = await this.app.refundOrder(this.siteId, this.orderId);

    $.export("$summary", "Successfully refunded order");

    return response;
  },
};
