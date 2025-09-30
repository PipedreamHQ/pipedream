import app from "../../webflow.app.mjs";

export default {
  key: "webflow-get-order",
  name: "Get Order",
  description: "Get info on an order. [See the documentation](https://developers.webflow.com/data/reference/ecommerce/orders/get)",
  version: "2.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.app.getOrder(this.siteId, this.orderId);

    $.export("$summary", "Successfully retrieved order");

    return response;
  },
};
