import shipstation from "../../shipstation.app.mjs";

export default {
  key: "shipstation-get-order",
  name: "Get Order",
  description: "Retrieve a single order by its ID. [See the documentation](https://docs.shipstation.com/apis/shipstation-v1/openapi/orders/get_order)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    shipstation,
    orderId: {
      propDefinition: [
        shipstation,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.shipstation.getOrder({
      orderId: this.orderId,
      $,
    });

    $.export("$summary", `Successfully retrieved order ${response.orderNumber}.`);

    return response;
  },
};
