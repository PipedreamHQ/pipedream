import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-verify-transaction",
  name: "Verify Transaction",
  description: "Confirm the status of a transaction. [See the documentation](https://paystack.com/docs/api/transaction/#verify)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    paystack,
    reference: {
      propDefinition: [
        paystack,
        "reference",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.paystack.verifyTransaction({
      $,
      reference: this.reference,
    });

    $.export("$summary", "Transaction verified");
    return response;
  },
};
