import app from "../../lightspeed_ecom_c_series.app.mjs";

export default {
  key: "lightspeed_ecom_c_series-get-order-products",
  name: "Get Order Products",
  description: "Get an order products by ID. [See the documentation](https://developers.lightspeedhq.com/ecom/endpoints/orderproduct/#get-all-order-products)",
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
    const response = this.app.paginate({
      $,
      fn: this.app.getOrderProducts,
      orderId: this.orderId,
      dataField: "orderProducts",
    });

    const products = [];
    for await (const product of response) {
      products.push(product);
    }

    $.export("$summary", `Successfully retrieved order ${products.length} product${products.length === 1
      ? ""
      : "s"} for order with ID: ${this.orderId}`);
    return products;
  },
};
