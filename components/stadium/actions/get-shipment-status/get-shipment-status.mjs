import stadium from "../../stadium.app.mjs";

export default {
  key: "stadium-get-shipment-status",
  name: "Get Shipment Status",
  description: "Get shipment status and tracking details for a placed order. [See the documentation](https://api.bystadium.com/api/v2/docs#tag/Order-management/operation/orderShipmentDetails)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    stadium,
    orderNumber: {
      propDefinition: [
        stadium,
        "orderNumber",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.stadium.getShipmentStatus({
      $,
      orderNumber: this.orderNumber,
    });
    $.export("$summary", `Successfully retrieved shipment status for order ${this.orderNumber}`);
    return response;
  },
};
