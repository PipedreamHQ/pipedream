// x-pd-ai: optimized
import monta from "../../monta.app.mjs";

export default {
  key: "monta-cancel-order",
  name: "Cancel Order",
  description: "Cancel (delete) an order. Monta rejects this once picking has started (error 18), after the order has shipped (error 19), or when returns exist (error 25). [See the documentation](https://api-v6.monta.nl/index.html#tag/Order/paths/~1order~1%7Bwebshoporderid%7D/delete)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    monta,
    orderId: {
      propDefinition: [
        monta,
        "orderId",
      ],
    },
    note: {
      type: "string",
      label: "Note",
      description: "The reason for cancelling the order",
    },
  },
  async run({ $ }) {
    await this.monta.cancelOrder({
      $,
      orderId: this.orderId,
      data: {
        Note: this.note,
      },
    });

    $.export("$summary", `Successfully cancelled order \`${this.orderId}\``);

    return {
      success: true,
    };
  },
};
