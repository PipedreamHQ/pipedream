import stadium from "../../stadium.app.mjs";

export default {
  key: "stadium-get-order-details",
  name: "Get Order Details",
  description: "Get details for a placed order. [See the documentation](https://api.bystadium.com/api/v2/docs#tag/Order-management/operation/orderDetails)",
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
    const response = await this.stadium.getOrderDetails({
      $,
      orderNumber: this.orderNumber,
    });
    $.export("$summary", `Successfully retrieved details for order ${this.orderNumber}`);
    return response;
  },
};
