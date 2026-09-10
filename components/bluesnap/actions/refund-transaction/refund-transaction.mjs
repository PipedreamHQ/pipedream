// x-pd-ai: optimized
import bluesnap from "../../bluesnap.app.mjs";

export default {
  key: "bluesnap-refund-transaction",
  name: "Refund Transaction",
  description: "Refund a BlueSnap transaction. Omit amount for a full refund or supply a partial amount. Use **List Transactions** first to find the transaction ID. [See the documentation](https://developers.bluesnap.com/v8976-JSON/reference/refund)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    bluesnap,
    transactionId: {
      propDefinition: [
        bluesnap,
        "transactionId",
      ],
      description: "The numeric transaction ID to refund (e.g. `1023190247`). Run the **List Transactions** action first to find valid IDs.",
    },
    amount: {
      propDefinition: [
        bluesnap,
        "amount",
      ],
      description: "Amount to refund as a decimal string (e.g. `29.99`). Omit for a full refund.",
      optional: true,
    },
    reason: {
      type: "string",
      label: "Reason",
      description: "Free-form reason for the refund (e.g. `DUPLICATE`).",
      optional: true,
    },
    cancelSubscriptions: {
      type: "boolean",
      label: "Cancel Subscriptions",
      description: "Whether to cancel any subscriptions associated with the transaction.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bluesnap.refundTransaction({
      $,
      transactionId: this.transactionId,
      data: {
        amount: this.amount,
        reason: this.reason,
        cancelSubscriptions: this.cancelSubscriptions,
      },
    });

    $.export("$summary", `Refunded transaction ${this.transactionId}`);
    return response;
  },
};
