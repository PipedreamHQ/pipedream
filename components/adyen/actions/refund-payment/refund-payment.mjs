import app from "../../adyen.app.mjs";

export default {
  key: "adyen-refund-payment",
  name: "Refund Payment",
  description: "Refunds a captured payment. [See the documentation](https://docs.adyen.com/api-explorer/checkout/71/post/payments/(paymentpspreference)/refunds)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    paymentPspReference: {
      propDefinition: [
        app,
        "paymentPspReference",
      ],
    },
    merchantAccount: {
      propDefinition: [
        app,
        "merchantAccount",
      ],
    },
    amountCurrency: {
      propDefinition: [
        app,
        "amountCurrency",
      ],
    },
    amountValue: {
      propDefinition: [
        app,
        "amountValue",
      ],
    },
  },
  methods: {
    refundPayment({
      paymentPspReference, data,
    } = {}) {
      return this.app.getCheckoutAPI()
        .ModificationsApi
        .refundCapturedPayment(paymentPspReference, data);
    },
  },
  async run({ $ }) {
    const {
      refundPayment,
      paymentPspReference,
      merchantAccount,
      amountCurrency,
      amountValue,
    } = this;

    const response = await refundPayment({
      paymentPspReference,
      data: {
        merchantAccount,
        amount: {
          currency: amountCurrency,
          value: amountValue,
        },
      },
    });
    $.export("$summary", `Successfully refunded payment with PSP Reference \`${response.paymentPspReference}\`.`);
    return response;
  },
};
