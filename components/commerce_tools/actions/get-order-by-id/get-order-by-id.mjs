import app from "../../commerce_tools.app.mjs";

export default {
  key: "commerce_tools-get-order-by-id",
  name: "Get Order by ID",
  description: "Retrieve an Order by its unique ID. [See the documentation](https://docs.commercetools.com/api/projects/orders#get-order-by-id).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    orderId: {
      propDefinition: [
        app,
        "orderId",
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
    const response = await this.app.getOrderById({
      $,
      id: this.orderId,
      params: {
        expand: this.expand,
      },
    });
    $.export("$summary", `Successfully retrieved Order \`${this.orderId}\``);
    return response;
  },
};
