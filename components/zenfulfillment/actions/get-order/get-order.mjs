import zenfulfillment from "../../zenfulfillment.app.mjs";

export default {
  key: "zenfulfillment-get-order",
  name: "Get Order",
  description: "Get an order by ID. [See the documentation](https://partner.alaiko.com/docs#tag/Order/operation/api_partnerorder_id_get)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zenfulfillment,
    orderId: {
      propDefinition: [
        zenfulfillment,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zenfulfillment.getOrder({
      $,
      orderId: this.orderId,
    });
    $.export("$summary", `Successfully retrieved order with ID \`${this.orderId}\`.`);
    return response;
  },
};
