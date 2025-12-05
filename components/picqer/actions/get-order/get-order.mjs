import picqer from "../../picqer.app.mjs";

export default {
  key: "picqer-get-order",
  name: "Get Picqer Order",
  description: "Get an order in Picqer. [See the documentation](https://picqer.com/en/api/orders#get-single-order)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    picqer,
    orderId: {
      propDefinition: [
        picqer,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.picqer.getOrder({
      $,
      orderId: this.orderId,
    });

    $.export("$summary", `Successfully retrieved order ${this.orderId}`);
    return response;
  },
};
