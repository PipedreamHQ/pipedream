import app from "../../adyen.app.mjs";

export default {
  key: "adyen-cancel-payment",
  name: "Cancel Payment",
  description: "Cancels a payment that has not yet been captured. [See the documentation](https://docs.adyen.com/api-explorer/checkout/71/post/payments/(paymentpspreference)/cancels)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
  },
  methods: {
    cancelPayment({
      paymentPspReference, data,
    } = {}) {
      return this.app.getCheckoutAPI()
        .ModificationsApi
        .cancelAuthorisedPaymentByPspReference(paymentPspReference, data);
    },
  },
  async run({ $ }) {
    const {
      cancelPayment,
      paymentPspReference,
      merchantAccount,
    } = this;

    const response = await cancelPayment({
      paymentPspReference,
      data: {
        merchantAccount,
      },
    });
    $.export("$summary", "Successfully cancelled payment.");
    return response;
  },
};
