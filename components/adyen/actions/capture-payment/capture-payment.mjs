import app from "../../adyen.app.mjs";

export default {
  key: "adyen-capture-payment",
  name: "Capture Payment",
  description: "Captures an authorized payment. This is typically used for delayed capture scenarios, such as when you need to verify the order before capturing the funds.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    capturePayment({
      paymentPspReference, data,
    } = {}) {
      return this.app.getCheckoutAPI()
        .ModificationsApi
        .captureAuthorisedPayment(paymentPspReference, data);
    },
  },
  async run({ $ }) {
    const {
      capturePayment,
      paymentPspReference,
      merchantAccount,
      amountCurrency,
      amountValue,
    } = this;

    const response = await capturePayment({
      paymentPspReference,
      data: {
        merchantAccount,
        amount: {
          currency: amountCurrency,
          value: amountValue,
        },
      },
    });

    $.export("$summary", "Successfully captured payment.");
    return response;
  },
};
