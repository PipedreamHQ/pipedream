const stripe = require("../../stripe.app.js");

module.exports = {
  name: "Retrieve Checkout Session Line Items",
  description: "Given a checkout session ID, retrieve the line items. [See the docs](https://stripe.com/docs/api/checkout/sessions/line_items)",
  key: "stripe-retrieve-checkout-session-line-items",
  version: "0.0.3",
  type: "action",
  props: {
    stripe,
    checkout_session_id: {
      type: "string",
      label: "Checkout Session ID",
      description: "The ID of a Stripe Checkout Session. [See the docs](https://stripe.com/docs/api/checkout/sessions/object#checkout_session_object-id)",
    },
    line_items_limit: {
      type: "integer",
      label: "Number of Line Items",
      description: "The number of line items to retrieve (min: 1, max: 100)",
      default: 1,
      min: 1,
      max: 100,
    },
  },
  async run ({ $ }) {
    const resp = await this.stripe.sdk().checkout.sessions.listLineItems(this.checkout_session_id, {
      limit: this.line_items_limit,
    });
    $.export("$summary", `Successfully retrieved ${resp.data.length} checkout session line items`);
    return resp;
  },
};
