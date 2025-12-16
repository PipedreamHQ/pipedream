import app from "../../woocommerce.app.mjs";

export default {
  key: "woocommerce-get-product",
  name: "Get Product",
  description: "Retrieve a specific product. [See the docs](https://woocommerce.github.io/woocommerce-rest-api-docs/#retrieve-a-product)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.app.getProduct(this.productId);

    $.export("$summary", `Successfully retrieved product ID: ${response.id}`);

    return response;
  },
};
