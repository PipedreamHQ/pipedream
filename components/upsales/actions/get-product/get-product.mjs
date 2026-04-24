import app from "../../upsales.app.mjs";

export default {
  key: "upsales-get-product",
  name: "Get Product",
  description: "Retrieves a product from Upsales. [See the documentation](https://api.upsales.com/#ed8a1ae9-37dc-4292-818c-40d66c11bf99)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    $.export("$summary", `Successfully retrieved the product "${response.data.name}" with ID: ${response.data.id}`);
    return response;
  },
};
