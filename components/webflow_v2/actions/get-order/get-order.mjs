import app from "../../webflow_v2.app.mjs";

export default {
  key: "webflow_v2-get-order",
  name: "Get Order",
  description: "Get info on an order. [See the docs here](https://developers.webflow.com/#get-order)",
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
    const response = await this.app.getOrder(this.siteId, this.orderId);

    $.export("$summary", "Successfully retrieved order");

    return response;
  },
};
