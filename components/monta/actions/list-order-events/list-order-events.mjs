import monta from "../../monta.app.mjs";

export default {
  key: "monta-list-order-events",
  name: "List Order Events",
  description: "List order events for an order. [See the documentation](https://api-v6.monta.nl/index.html#tag/Order/paths/~1order~1%7Bwebshoporderid%7D~1events/get)",
  version: "0.0.2",
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
    let events = await this.monta.listOrderEvents({
      $,
      orderId: this.orderId,
    });

    $.export("$summary", `Successfully retrieved ${events.length} event${events.length === 1
      ? ""
      : "s"}`);

    return events;
  },
};
