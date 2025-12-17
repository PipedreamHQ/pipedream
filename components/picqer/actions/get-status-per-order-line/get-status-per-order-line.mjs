import picqer from "../../picqer.app.mjs";

export default {
  key: "picqer-get-status-per-order-line",
  name: "Get Status Per Order Line",
  description: "Get the status per order line in Picqer. [See the documentation](https://picqer.com/en/api/orders#get-status-per-order-line)",
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
      description: "Get the status per order line for this order.",
    },
  },
  async run({ $ }) {
    const response = await this.picqer.getStatusPerOrderLine({
      $,
      orderId: this.orderId,
    });

    $.export("$summary", `Successfully retrieved status per order line for order ${this.orderId}`);
    return response;
  },
};
