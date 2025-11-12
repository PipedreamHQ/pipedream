import digitalriver from "../../digitalriver.app.mjs";

export default {
  key: "digitalriver-cancel-order",
  name: "Cancel Order",
  description: "Cancels an existing order in Digital River. [See the documentation](https://www.digitalriver.com/docs/digital-river-api-reference/#tag/Fulfillments/operation/createFulfillments)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    digitalriver,
    orderId: {
      propDefinition: [
        digitalriver,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const { items } = await this.digitalriver.getOrderDetails({
      orderId: this.orderId,
    });

    const response = await this.digitalriver.cancelOrder({
      $,
      data: {
        orderId: this.orderId,
        items: items.map((item) => ({
          itemId: item.id,
          cancelQuantity: item.quantity,
        })),
      },
    });

    $.export("$summary", `Successfully cancelled order with ID ${this.orderId}`);
    return response;
  },
};
