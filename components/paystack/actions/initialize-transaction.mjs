import paystack from "../paystack.app.mjs";

export default {
  key: "paystack-initialize-transaction",
  name: "Initialize Transaction",
  description:
    "Initializes a new transaction on Paystack. [See the documentation](https://paystack.com/docs/api/transaction/#initialize)",
  version: "0.0.10",
  type: "action",
  props: {
    paystack,
    email: {
      propDefinition: [paystack, "email"],
    },
    amount: {
      propDefinition: [paystack, "amount"],
    },
    currency: {
      propDefinition: [paystack, "currency"],
      optional: true,
    },
    reference: {
      propDefinition: [paystack, "reference"],
      optional: true,
    },
    callback_url: {
      propDefinition: [paystack, "callback_url"],
      optional: true,
    },
    metadata: {
      propDefinition: [paystack, "metadata"],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.paystack.initializeTransaction({
      email: this.email,
      amount: this.amount,
    });

    $.export("$summary", `Transaction initialized`);
    return response;
  },
};
