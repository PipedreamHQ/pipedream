import virtualsms from "../../virtualsms.app.mjs";

export default {
  key: "virtualsms-cancel-rental",
  name: "Cancel Rental",
  description: "Cancel an active rental and refund any unused balance. Cancellation is only possible while the rental is still active and no SMS has been received (or the cancellation policy permits a refund). [See the documentation](https://virtualsms.io/docs/api-reference/introduction)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    virtualsms,
    orderId: {
      propDefinition: [
        virtualsms,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.virtualsms.cancelOrder({
      $,
      orderId: this.orderId,
    });

    // Real API returns { success, order_id, status: "cancelled", refund_amount }
    const refundAmount = typeof response?.refund_amount === "number"
      ? response.refund_amount
      : null;
    const cancelled = response?.status === "cancelled";

    let summary;
    if (cancelled && refundAmount !== null && refundAmount > 0) {
      summary = `Cancelled rental ${this.orderId} (refunded $${refundAmount.toFixed(2)})`;
    } else if (cancelled) {
      summary = `Cancelled rental ${this.orderId} (no refund)`;
    } else {
      summary = `Cancel attempt for rental ${this.orderId} — status ${response?.status ?? "unknown"}`;
    }
    $.export("$summary", summary);
    return response;
  },
};
