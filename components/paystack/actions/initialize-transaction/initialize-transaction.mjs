import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-initialize-transaction",
  name: "Initialize Transaction",
  description: "Initializes a new transaction on Paystack. [See the documentation](https://paystack.com/docs/api/transaction/#initialize)",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    paystack,
    email: {
      propDefinition: [
        paystack,
        "email",
      ],
    },
    amount: {
      propDefinition: [
        paystack,
        "amount",
      ],
    },
    currency: {
      propDefinition: [
        paystack,
        "currency",
      ],
      optional: true,
    },
    reference: {
      propDefinition: [
        paystack,
        "reference",
      ],
      optional: true,
    },
    callbackUrl: {
      propDefinition: [
        paystack,
        "callbackUrl",
      ],
      optional: true,
    },
    metadata: {
      propDefinition: [
        paystack,
        "metadata",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.paystack.initializeTransaction({
      $,
      data: {
        email: this.email,
        amount: this.amount,
        currency: this.currency,
        reference: this.reference,
        callback_url: this.callbackUrl,
        metadata: this.metadata,
      },
    });

    $.export("$summary", "Transaction initialized");
    return response;
  },
};
