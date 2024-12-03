import app from "../../webflow.app.mjs";

export default {
  key: "webflow-unfulfill-order",
  name: "Unfulfill Order",
  description: "Unfulfill an order. [See the docs here](https://developers.webflow.com/#unfulfill-order)",
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
    const response = await this.app.unfulfillOrder(this.siteId, this.orderId);

    $.export("$summary", "Successfully unfulfilled order");

    return response;
  },
};
