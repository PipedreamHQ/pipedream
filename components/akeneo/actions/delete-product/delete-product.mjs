import akeneo from "../../akeneo.app.mjs";

export default {
  key: "akeneo-delete-product",
  name: "Delete Product",
  description: "Delete a product from Akeneo. [See the documentation](https://api.akeneo.com/api-reference.html#delete_products__code_)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    akeneo,
    productId: {
      propDefinition: [
        akeneo,
        "productId",
      ],
      description: "Identifier of the product to delete",
    },
  },
  async run({ $ }) {
    const response = await this.akeneo.deleteProduct({
      $,
      productId: this.productId,
    });
    $.export("$summary", `Successfully deleted product ${this.productId}`);
    return response;
  },
};
