import app from "../../webflow.app.mjs";

export default {
  key: "webflow-unfulfill-order",
  name: "Unfulfill Order",
  description: "Unfulfill an order. [See the documentation](https://developers.webflow.com/data/reference/ecommerce/orders/update-unfulfill)",
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
  },
  async run({ $ }) {
    const response = await this.app.unfulfillOrder(this.siteId, this.orderId);

    $.export("$summary", "Successfully unfulfilled order");

    return response;
  },
};
