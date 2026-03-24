import everstox from "../../everstox.app.mjs";

export default {
  key: "everstox-get-order",
  name: "Get Order",
  description: "Get an order from Everstox. [See the documentation](https://api.everstox.com/api/v1/ui/#/Order/district_core.api.shops.orders.orders.Orders.get)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    everstox,
    orderId: {
      propDefinition: [
        everstox,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.everstox.getOrder({
      $,
      orderId: this.orderId,
    });

    $.export("$summary", `Successfully retrieved order with ID \`${this.orderId}\`.`);

    return response;
  },
};
