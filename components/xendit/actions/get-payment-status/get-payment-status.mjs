import xendit from "../../xendit.app.mjs";

export default {
  key: "xendit-get-payment-status",
  name: "Get Payment Status",
  description: "Get the status of a payment request. [See the documentation](https://developers.xendit.co/api-reference/payments-api/#get-payment-request-by-id)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    xendit,
    paymentRequestId: {
      propDefinition: [
        xendit,
        "paymentRequestId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.xendit.getPaymentRequest({
      $,
      paymentRequestId: this.paymentRequestId,
    });

    $.export("$summary", `Payment status: ${response.status}`);
    return response;
  },
};
