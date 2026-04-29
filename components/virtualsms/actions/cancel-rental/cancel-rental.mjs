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

    const refunded = response?.refunded
      ? "refunded"
      : "no refund";
    $.export("$summary", `Cancelled rental ${this.orderId} (${refunded})`);
    return response;
  },
};
