import app from "../../webflow.app.mjs";

export default {
  key: "webflow-get-order",
  name: "Get Order",
  description: "Get info on an order. [See the docs here](https://developers.webflow.com/#get-order)",
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
    const response = await this.app.getOrder(this.siteId, this.orderId);

    $.export("$summary", "Successfully retrieved order");

    return response;
  },
};
