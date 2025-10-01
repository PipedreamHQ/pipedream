import app from "../../modelry.app.mjs";

export default {
  key: "modelry-delete-product",
  name: "Delete Product",
  description: "Delete the product with the specified ID. [See the documentation](https://files.cgtarsenal.com/api/doc/index.html#api-Products-DeleteProduct)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    const response = await this.app.deleteProduct({
      $,
      productId: this.productId,
    });
    $.export("$summary", "Successfully deleted the product");
    return response;
  },
};
