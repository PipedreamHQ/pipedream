import paymentApp from "../../payment_app.app.mjs";

export default {
  key: "btcpay-server-create-payment-request",
  name: "Create Payment Request",
  description: "Generates a new payment request for a user. Required props include the amount and currency, while optional props can include an expiry date or custom metadata.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    paymentApp,
    amount: {
      propDefinition: [
        paymentApp,
        "amount",
      ],
    },
    currency: {
      propDefinition: [
        paymentApp,
        "currency",
      ],
    },
    expiryDate: {
      propDefinition: [
        paymentApp,
        "expiryDate",
      ],
    },
    metadata: {
      propDefinition: [
        paymentApp,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.paymentApp.createPaymentRequest({
      amount: this.amount,
      currency: this.currency,
      expiryDate: this.expiryDate,
      metadata: this.metadata,
    });
    $.export("$summary", `Successfully created payment request with ID: ${response.id}`);
    return response;
  },
};
