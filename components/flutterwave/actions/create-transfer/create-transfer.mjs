import flutterwave from "../../flutterwave.app.mjs";

export default {
  key: "flutterwave-create-transfer",
  name: "Create Transfer",
  description: "This action initiates a new transfer. [See the documentation](https://developer.flutterwave.com/reference/endpoints/transfers)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    flutterwave,
    bank: {
      propDefinition: [
        flutterwave,
        "bank",
      ],
    },
    currency: {
      propDefinition: [
        flutterwave,
        "currency",
      ],
    },
    payoutSubaccount: {
      propDefinition: [
        flutterwave,
        "payoutSubaccount",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.flutterwave.initiateTransfer({
      bank: this.bank,
      currency: this.currency,
      payoutSubaccount: this.payoutSubaccount,
    });

    $.export("$summary", `Transfer initiated successfully with ID: ${response.data.id}`);
    return response;
  },
};
