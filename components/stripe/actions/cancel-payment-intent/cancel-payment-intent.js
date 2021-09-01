const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-cancel-payment-intent",
  name: "Cancel a Payment Intent",
  type: "action",
  version: "0.0.1",
  description: "Cancel a [payment intent](https://stripe.com/docs/payments/payment-intents). " +
    "Once canceled, no additional charges will be made by the payment intent and any operations " +
    "on the payment intent will fail with an error. For payment intents with status=" +
    "`requires_capture`, the remaining amount_capturable will automatically be refunded.",
  props: {
    stripe,
    id: {
      propDefinition: [
        stripe,
        "payment_intent",
      ],
      optional: false,
    },
    cancellation_reason: {
      propDefinition: [
        stripe,
        "payment_intent_cancellation_reason",
      ],
    },
  },
  async run() {
    const params = pick(this, [
      "cancellation_reason",
    ]);
    return await this.stripe.sdk().paymentIntents.cancel(this.id, params);
  },
};
