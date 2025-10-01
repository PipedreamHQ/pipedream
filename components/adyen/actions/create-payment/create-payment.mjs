import app from "../../adyen.app.mjs";

export default {
  key: "adyen-create-payment",
  name: "Create Payment",
  description: "Creates a payment for a shopper. [See the documentation](https://docs.adyen.com/api-explorer/Checkout/71/post/payments)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
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
    reference: {
      type: "string",
      label: "Reference",
      description: "The reference to uniquely identify a payment. This reference is used in all communication with you about the payment status. We recommend using a unique value per payment; however, it is not a requirement. If you need to provide multiple references for a transaction, separate them with hyphens (`-`). Maximum length: 80 characters.",
    },
    returnUrl: {
      type: "string",
      label: "Return URL",
      description: "The URL to return to in case of a redirection. The format depends on the channel. For more information refer the [documentation](https://docs.adyen.com/api-explorer/Checkout/71/post/payments#request-returnUrl).",
    },
    paymentMethodType: {
      propDefinition: [
        app,
        "paymentMethodType",
        ({ merchantAccount }) => ({
          merchantAccount,
        }),
      ],
    },
    paymentMethodDetails: {
      type: "object",
      label: "Payment Method Details",
      description: "The payment method details object required for submitting additional payment details. Should contain relevant payment details fields. For more information refer the [documentation](https://docs.adyen.com/api-explorer/Checkout/71/post/payments#request-paymentMethod).",
      optional: true,
    },
  },
  methods: {
    createPayment({ data } = {}) {
      return this.app.getCheckoutAPI()
        .PaymentsApi
        .payments(data);
    },
  },
  async run({ $ }) {
    const {
      createPayment,
      amountCurrency,
      amountValue,
      merchantAccount,
      reference,
      returnUrl,
      paymentMethodType,
      paymentMethodDetails,
    } = this;

    const response = await createPayment({
      data: {
        amount: {
          currency: amountCurrency,
          value: amountValue,
        },
        merchantAccount,
        reference,
        returnUrl,
        paymentMethod: {
          ...paymentMethodDetails,
          type: paymentMethodType,
        },
      },
    });
    $.export("$summary", "Successfully created payment.");
    return response;
  },
};
