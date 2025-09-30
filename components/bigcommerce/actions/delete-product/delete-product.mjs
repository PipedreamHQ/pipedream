import bigcommerce from "../../bigcommerce.app.mjs";

export default {
  key: "bigcommerce-delete-product",
  name: "Delete Product",
  description:
    "Delete a product by Id. [See the docs here](https://developer.bigcommerce.com/api-reference/76f5ebcdab695-delete-a-product)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bigcommerce,
    productId: {
      propDefinition: [
        bigcommerce,
        "productId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bigcommerce.deleteProduct({
      $,
      productId: this.productId,
    });

    $.export("$summary", `Successfully deleted product ${this.productId}`);
    return response.data;
  },
};
