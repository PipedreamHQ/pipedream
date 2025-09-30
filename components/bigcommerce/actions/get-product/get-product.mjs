import bigcommerce from "../../bigcommerce.app.mjs";

export default {
  key: "bigcommerce-get-product",
  name: "Get Product By Id",
  description:
    "Get a specific product by id. [See the docs here](https://developer.bigcommerce.com/api-reference/6fe995bba597e-get-a-product)",
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
    const { data } = await this.bigcommerce.getProduct({
      $,
      productId: this.productId,
    });

    $.export("$summary", `Successfully fetched product ${data.name}`);
    return data;
  },
};
