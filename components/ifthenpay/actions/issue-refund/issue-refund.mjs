import ifthenpay from "../../ifthenpay.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ifthenpay-issue-refund",
  name: "Issue Refund",
  description: "Issue a full or partial refund for a previously completed payment via Ifthenpay. [See the documentation](https://ifthenpay.com/docs/en/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ifthenpay,
    originalPaymentId: {
      propDefinition: [
        ifthenpay,
        "originalPaymentId",
      ],
    },
    refundAmount: {
      propDefinition: [
        ifthenpay,
        "refundAmount",
      ],
    },
    reasonForRefund: {
      propDefinition: [
        ifthenpay,
        "reasonForRefund",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ifthenpay.refundPayment({
      originalPaymentId: this.originalPaymentId,
      refundAmount: this.refundAmount,
      reasonForRefund: this.reasonForRefund,
    });

    $.export("$summary", `Successfully issued a refund for payment ID: ${this.originalPaymentId}`);
    return response;
  },
};
