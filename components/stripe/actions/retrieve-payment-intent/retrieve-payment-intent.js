const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-retrieve-payment-intent",
  name: "Retrieve a Payment Intent",
  type: "action",
  version: "0.0.1",
  description: "Retrieves the details of a " +
    "[payment intent](https://stripe.com/docs/payments/payment-intents) that was previously " +
    "created",
  props: {
    stripe,
    client_secret: {
      propDefinition: [
        stripe,
        "payment_intent_client_secret",
      ],
      optional: false,
    },
  },
  async run() {
    return await this.stripe.sdk().paymentIntents.retrieve(this.client_secret);
  },
};
