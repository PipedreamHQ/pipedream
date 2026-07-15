import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-retrieve-product",
  name: "Retrieve Product",
  description: "Retrieve a product by ID or slug. [See the documentation](https://developer.surecart.com/api-reference/products/retrieve)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    productId: {
      propDefinition: [
        surecart,
        "productId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.getProduct({
      $,
      productId: this.productId,
    });
    $.export("$summary", `Successfully retrieved product ${this.productId}`);
    return response;
  },
};
