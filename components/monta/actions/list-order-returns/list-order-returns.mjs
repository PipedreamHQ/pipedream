import monta from "../../monta.app.mjs";

export default {
  key: "monta-list-order-returns",
  name: "List Order Returns",
  description: "List the return records for an order. Use this to see all returns registered against an order. [See the documentation](https://api-v6.monta.nl/index.html#tag/Order/paths/~1order~1%7Bwebshoporderid%7D~1return/get)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
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
    const response = await this.monta.listReturns({
      $,
      orderId: this.orderId,
    });
    const returns = response.Returns ?? [];

    $.export("$summary", `Successfully retrieved ${returns.length} return${returns.length === 1
      ? ""
      : "s"} for order \`${this.orderId}\``);

    return returns;
  },
};
