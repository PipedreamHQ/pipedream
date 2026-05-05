import zenfulfillment from "../../zenfulfillment.app.mjs";

export default {
  key: "zenfulfillment-get-order-return",
  name: "Get Order Return",
  description: "Get an order return by ID. [See the documentation](https://partner.alaiko.com/docs#tag/OrderReturn/operation/api_partnerorder-return_id_get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zenfulfillment,
    orderReturnId: {
      propDefinition: [
        zenfulfillment,
        "orderReturnId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zenfulfillment.getOrderReturn({
      $,
      orderReturnId: this.orderReturnId,
    });
    $.export("$summary", `Successfully retrieved order return with ID \`${this.orderReturnId}\`.`);
    return response;
  },
};
