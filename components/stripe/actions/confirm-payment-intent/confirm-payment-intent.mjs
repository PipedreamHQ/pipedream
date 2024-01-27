import pick from "lodash.pick";
import app from "../../stripe.app.mjs";

export default {
  key: "stripe-confirm-payment-intent",
  name: "Confirm a Payment Intent",
  type: "action",
  version: "0.1.0",
  description: "Confirm that your customer intends to pay with current or provided payment " +
    "method. Upon confirmation, Stripe will attempt to initiate a payment. [See the " +
    "docs](https://stripe.com/docs/api/payment_intents/confirm) for more information",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "payment_intent",
      ],
      optional: false,
    },
    // Needed to populate the options for payment_method
    customer: {
      propDefinition: [
        app,
        "customer",
      ],
    },
    payment_method: {
      propDefinition: [
        app,
        "payment_method",
        ({ customer }) => ({
          customer,
        }),
      ],
    },
    receipt_email: {
      propDefinition: [
        app,
        "email",
      ],
      label: "Receipt Email",
    },
    setup_future_usage: {
      propDefinition: [
        app,
        "setup_future_usage",
      ],
    },
    advanced: {
      propDefinition: [
        app,
        "metadata",
      ],
      label: "Advanced Options",
      description: "Specify less-common options that you require. See [Confirm a PaymentIntent]" +
        "(https://stripe.com/docs/api/payment_intents/confirm) for a list of supported options.",
    },
  },
  async run({ $ }) {
    const params = pick(this, [
      "payment_method",
      "receipt_email",
      "setup_future_usage",
    ]);
    const resp = await this.app.sdk().paymentIntents.confirm(this.id, {
      ...params,
      ...this.advanced,
    });
    $.export("$summary", "Successfully confirmed the payment intent");
    return resp;
  },
};
