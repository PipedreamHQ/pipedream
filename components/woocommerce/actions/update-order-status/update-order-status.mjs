import woocommerce from "../../woocommerce.app.mjs";

export default {
  key: "woocommerce-update-order-status",
  name: "Update Order Status",
  description: "Update the status of a specific order. [See the docs](https://woocommerce.github.io/woocommerce-rest-api-docs/?javascript#update-an-order)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    orderStatus: {
      propDefinition: [
        woocommerce,
        "orderStatus",
      ],
      optional: false,
    },
  },
  async run({ $ }) {

    const data = {
      status: this.orderStatus,
    };

    const response = await this.woocommerce.updateOrder(this.orderId, data);

    $.export("$summary", `Successfully updated status to ${this.orderStatus} for order ID: ${response.id}`);

    return response;
  },
};
