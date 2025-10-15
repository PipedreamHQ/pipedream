import app from "../../lightspeed_ecom_c_series.app.mjs";

export default {
  key: "lightspeed_ecom_c_series-get-product",
  name: "Get Product",
  description: "Get a product by ID. [See the documentation](https://developers.lightspeedhq.com/ecom/endpoints/product/#get-retrieve-a-product)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    productId: {
      propDefinition: [
        app,
        "productId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getProduct({
      $,
      productId: this.productId,
    });
    $.export("$summary", `Successfully retrieved product with ID: ${this.productId}`);
    return response;
  },
};
