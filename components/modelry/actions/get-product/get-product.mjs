import app from "../../modelry.app.mjs";

export default {
  key: "modelry-get-product",
  name: "Get Product",
  description: "Get details of the product with the specified ID. [See the documentation](https://files.cgtarsenal.com/api/doc/index.html#api-Products-GetProduct)",
  version: "0.0.1",
  type: "action",
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
    $.export("$summary", "Successfully retrieved the product details");
    return response;
  },
};
