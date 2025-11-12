import app from "../../dingconnect.app.mjs";

export default {
  key: "dingconnect-get-products",
  name: "Get Products",
  description: "Retrieves a list of products from DingConnect. [See the documentation](https://www.dingconnect.com/api#operation/getproducts)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getProducts({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.Items.length} products`);

    return response;
  },
};
