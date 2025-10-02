import woocommerce from "../../woocommerce.app.mjs";

export default {
  key: "woocommerce-get-order",
  name: "Get Order",
  description: "Retrieve a specific order. [See the docs](https://woocommerce.github.io/woocommerce-rest-api-docs/?javascript#retrieve-an-order)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    woocommerce,
    orderId: {
      propDefinition: [
        woocommerce,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.woocommerce.getOrder(this.orderId);

    $.export("$summary", `Successfully retrieved order ID: ${response.id}`);

    return response;
  },
};
