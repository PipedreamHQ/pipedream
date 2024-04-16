import smartroutes from "../../smartroutes.app.mjs";

export default {
  key: "smartroutes-create-order",
  name: "Create Order",
  description: "Creates a new order in the smartroutes. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    smartroutes,
    orderDetails: {
      propDefinition: [
        smartroutes,
        "orderDetails",
      ],
    },
    userInfo: {
      propDefinition: [
        smartroutes,
        "userInfo",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.smartroutes.createOrder(this.orderDetails, this.userInfo);
    $.export("$summary", `Successfully created order with ID: ${response.id}`);
    return response;
  },
};
