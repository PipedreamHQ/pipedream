import app from "../../modelry.app.mjs";

export default {
  key: "modelry-get-product",
  name: "Get Product",
  description: "Get details of the product with the specified ID. [See the documentation](https://files.cgtarsenal.com/api/doc/index.html#api-Products-GetProduct)",
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
    const response = await this.app.getProduct({
      $,
      productId: this.productId,
    });
    $.export("$summary", `Successfully retrieved the details for the product "${response.data.attributes.title}" with ID: ${response.data.id}`);
    return response;
  },
};
