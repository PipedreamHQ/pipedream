import app from "../../commerce_tools.app.mjs";

export default {
  key: "commerce_tools-get-order-by-order-number",
  name: "Get Order by Order Number",
  description: "Retrieve an Order by its `orderNumber`. [See the documentation](https://docs.commercetools.com/api/projects/orders#get-order-by-ordernumber).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    orderNumber: {
      propDefinition: [
        app,
        "orderNumber",
      ],
    },
    expand: {
      propDefinition: [
        app,
        "expand",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getOrderByOrderNumber({
      $,
      orderNumber: this.orderNumber,
      params: {
        expand: this.expand,
      },
    });
    $.export("$summary", `Successfully retrieved Order with number \`${this.orderNumber}\``);
    return response;
  },
};
