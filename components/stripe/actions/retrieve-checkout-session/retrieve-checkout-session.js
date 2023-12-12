const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-retrieve-checkout-session",
  name: "Retrieve a Checkout Session",
  type: "action",
  version: "0.0.2",
  description: "A Checkout Session represents your customer's session as they pay for one-time " +
    "purchases or subscriptions through Stripe Checkout. [See the " +
    "docs](https://stripe.com/docs/api/checkout/sessions/retrieve) for more information",
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
  async run({ $ }) {
    const resp = await this.stripe.sdk().checkout.sessions.retrieve(this.id);
    $.export("$summary", `Successfully retrieved the checkout session, "${resp.id}"`);
    return resp;
  },
};
