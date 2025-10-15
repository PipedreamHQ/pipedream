import app from "../../lightspeed_ecom_c_series.app.mjs";

export default {
  key: "lightspeed_ecom_c_series-get-order",
  name: "Get Order",
  description: "Get an order by ID. [See the documentation](https://developers.lightspeedhq.com/ecom/endpoints/order/#get-retrieve-an-order)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    orderId: {
      propDefinition: [
        app,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getOrder({
      $,
      orderId: this.orderId,
    });
    $.export("$summary", `Successfully retrieved order with ID: ${this.orderId}`);
    return response;
  },
};
