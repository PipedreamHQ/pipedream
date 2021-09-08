const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-retrieve-checkout-session",
  name: "Retrieve a Checkout Session",
  type: "action",
  version: "0.0.1",
  description: "A Checkout Session represents your customer's session as they pay for one-time " +
    "purchases or subscriptions through Stripe Checkout.",
  props: {
    stripe,
    id: {
      propDefinition: [
        stripe,
        "checkout_session",
      ],
      optional: false,
    },
  },
  async run() {
    return await this.stripe.sdk().checkout.sessions.retrieve(this.id);
  },
};
