const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-confirm-payment-intent",
  name: "Confirm a Payment Intent",
  type: "action",
  version: "0.0.2",
  description: "Confirm that your customer intends to pay with current or provided payment " +
    "method. Upon confirmation, Stripe will attempt to initiate a payment. [See the " +
    "docs](https://stripe.com/docs/api/payment_intents/confirm) for more information",
  props: {
    stripe,
    id: {
      propDefinition: [
        stripe,
        "payment_intent",
      ],
      optional: false,
    },
    // Needed to populate the options for payment_method
    customer: {
      propDefinition: [
        stripe,
        "customer",
      ],
    },
    payment_method: {
      propDefinition: [
        stripe,
        "payment_method",
        ({ customer }) => ({
          customer,
        }),
      ],
    },
    receipt_email: {
      propDefinition: [
        stripe,
        "email",
      ],
      label: "Receipt Email",
    },
    setup_future_usage: {
      propDefinition: [
        stripe,
        "setup_future_usage",
      ],
    },
    advanced: {
      propDefinition: [
        stripe,
        "advanced",
      ],
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
    const resp = await this.stripe.sdk().paymentIntents.confirm(this.id, {
      ...params,
      ...this.advanced,
    });
    $.export("$summary", "Successfully confirmed the payment intent");
    return resp;
  },
};
