import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-delete-product",
  name: "Delete Product",
  description: "Delete a product by ID. [See the documentation](https://developer.surecart.com/api-reference/products/delete)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.surecart.deleteProduct({
      $,
      productId: this.productId,
    });
    $.export("$summary", `Successfully deleted product ${this.productId}`);
    return response;
  },
};
