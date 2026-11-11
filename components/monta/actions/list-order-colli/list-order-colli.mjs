import monta from "../../monta.app.mjs";

export default {
  key: "monta-list-order-colli",
  name: "List Order Colli",
  description: "List the colli (parcels) that make up an order. Use this to inspect the parcel and tracking breakdown for a shipment, for example after registering parcels with the **Add Order Colli** action. [See the documentation](https://api-v6.monta.nl/index.html#tag/Order/paths/~1order~1%7Bwebshoporderid%7D~1colli/get)",
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
    const response = await this.monta.listOrderColli({
      $,
      orderId: this.orderId,
    });
    const boxes = response.BoxesShipped ?? 0;

    $.export("$summary", `Successfully retrieved colli for order \`${this.orderId}\` (${boxes} box${boxes === 1
      ? ""
      : "es"} shipped)`);

    return response;
  },
};
