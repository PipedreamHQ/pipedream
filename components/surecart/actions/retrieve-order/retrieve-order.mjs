import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-retrieve-order",
  name: "Retrieve Order",
  description: "Retrieve an order by ID. [See the documentation](https://developer.surecart.com/api-reference/orders/retrieve)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    orderId: {
      propDefinition: [
        surecart,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.getOrder({
      $,
      orderId: this.orderId,
    });
    $.export("$summary", `Successfully retrieved order ${this.orderId}`);
    return response;
  },
};
