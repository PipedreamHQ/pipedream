import stadium from "../../stadium.app.mjs";

export default {
  key: "stadium-checkout-order",
  name: "Checkout Order",
  description: "Checkout a placed order using the specified payment method. [See the documentation](https://api.bystadium.com/api/v2/docs#tag/Order-management/operation/orderCheckout)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    stadium,
    orderNumber: {
      propDefinition: [
        stadium,
        "orderNumber",
      ],
    },
    paymentMethod: {
      propDefinition: [
        stadium,
        "paymentMethod",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.stadium.checkoutOrder({
      $,
      orderNumber: this.orderNumber,
      paymentMethod: this.paymentMethod,
    });
    $.export("$summary", `Successfully checked out order ${this.orderNumber}`);
    return response;
  },
};
