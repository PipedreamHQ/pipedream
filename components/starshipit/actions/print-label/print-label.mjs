import starshipit from "../../starshipit.app.mjs"

export default {
  key: "starshipit-print-label",
  name: "Print Shipping Label",
  description: "Print a shipping label for a specific order. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    starshipit,
    orderNumber: {
      propDefinition: [
        starshipit,
        "orderNumber"
      ]
    },
  },
  async run({ $ }) {
    const response = await this.starshipit.printShippingLabel(this.orderNumber);
    $.export("$summary", `Successfully printed shipping label for order number ${this.orderNumber}`);
    return response;
  },
};