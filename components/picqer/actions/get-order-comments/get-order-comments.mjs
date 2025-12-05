import app from "../../picqer.app.mjs";

export default {
  key: "picqer-get-order-comments",
  name: "Get Order Comments",
  description: "Retrieves comments linked to an order. [See the documentation](https://picqer.com/en/api/orders)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    orderId: {
      propDefinition: [
        app,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getOrderComments({
      $,
      orderId: this.orderId,
    });

    $.export("$summary", `Successfully retrieved ${response.length} comment(s) for order ${this.orderId}`);
    return response;
  },
};
