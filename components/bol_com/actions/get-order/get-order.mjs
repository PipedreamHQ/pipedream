import bolCom from "../../bol_com.app.mjs";

export default {
  key: "bol_com-get-order",
  name: "Get Order",
  description: "Get an order. [See the documentation](https://api.bol.com/retailer/public/redoc/v10/retailer.html#tag/Orders/operation/get-order)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bolCom,
    orderId: {
      propDefinition: [
        bolCom,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bolCom.getOrder({
      $,
      orderId: this.orderId,
    });
    $.export("$summary", `Successfully retrieved order: ${response.orderId}`);
    return response;
  },
};
