import starshipit from "../../starshipit.app.mjs"

export default {
  key: "starshipit-create-order",
  name: "Create Order",
  description: "Create an outbound order in Starshipit. [See the documentation](https://api-docs.starshipit.com/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    starshipit,
    orderDetails: {
      propDefinition: [
        starshipit,
        "orderDetails"
      ]
    },
  },
  async run({ $ }) {
    const response = await this.starshipit.createOrder(this.orderDetails);
    $.export("$summary", `Successfully created order with ID: ${response.OrderNumber}`);
    return response;
  },
};