import bigcommerce from "../../bigcommerce.app.mjs";

export default {
  key: "bigcommerce-get-product-variants",
  name: "Get Product Variants",
  description:
    "Get all product variants. [See the docs here](https://developer.bigcommerce.com/api-reference/02db3ddfc6be7-get-all-product-variants)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const { data } = await this.bigcommerce.getProductVariants({
      $,
      productId: this.productId,
    });

    $.export("$summary", "Successfully fetched product variants");
    return data;
  },
};
