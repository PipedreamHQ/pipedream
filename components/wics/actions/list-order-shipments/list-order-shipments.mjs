import wics from "../../wics.app.mjs";

export default {
  key: "wics-list-order-shipments",
  name: "List Order Shipments",
  description: "List shipments for an order by reference. [See the documentation](https://docs.wics.nl/#orders-list-shipments-for-order)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    wics,
    orderReference: {
      propDefinition: [
        wics,
        "orderReference",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.wics.listOrderShipments({
      orderReference: this.orderReference,
      $,
    });

    const data = response?.data ?? [];

    $.export(
      "$summary",
      `Successfully retrieved ${data.length} shipment(s) for order ${this.orderReference}`,
    );

    return data;
  },
};
