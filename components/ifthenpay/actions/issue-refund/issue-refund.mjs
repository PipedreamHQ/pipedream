import ifthenpay from "../../ifthenpay.app.mjs";

export default {
  key: "ifthenpay-issue-refund",
  name: "Issue Refund",
  description: "Issue a full or partial refund for a previously completed payment via Ifthenpay. [See the documentation](https://ifthenpay.com/docs/en/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ifthenpay,
    requestId: {
      propDefinition: [
        ifthenpay,
        "requestId",
      ],
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The amount to be refunded.",
    },
  },
  async run({ $ }) {
    const response = await this.ifthenpay.refundPayment({
      $,
      data: {
        backofficekey: this.ifthenpay.$auth.backoffice_key,
        requestId: this.requestId,
        amount: this.amount,
      },
    });

    $.export("$summary", `Successfully issued a refund for payment ID: ${this.requestId}`);
    return response;
  },
};
