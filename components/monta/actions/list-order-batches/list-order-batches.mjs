import monta from "../../monta.app.mjs";

export default {
  key: "monta-list-order-batches",
  name: "List Order Batches",
  description: "List the batch (lot) lines shipped for an order. Use this for batch traceability when you need to know which lots were used to fulfill an order. [See the documentation](https://api-v6.monta.nl/index.html#tag/Order/paths/~1order~1%7Bwebshoporderid%7D~1batches/get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    monta,
    orderId: {
      propDefinition: [
        monta,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.monta.listOrderBatches({
      $,
      orderId: this.orderId,
    });
    const count = response.BatchLines?.length ?? 0;

    $.export("$summary", `Successfully retrieved ${count} batch line${count === 1
      ? ""
      : "s"} for order \`${this.orderId}\``);

    return response;
  },
};
