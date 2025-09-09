import app from "../../stripe.app.mjs";

export default {
  name: "Retrieve Checkout Session Line Items",
  description: "Given a checkout session ID, retrieve the line items. [See the documentation](https://stripe.com/docs/api/checkout/sessions/line_items).",
  key: "stripe-retrieve-checkout-session-line-items",
  version: "0.1.3",
  type: "action",
  props: {
    app,
    checkoutSessionId: {
      type: "string",
      label: "Checkout Session ID",
      description: "The ID of a Stripe Checkout Session. [See the documentation](https://stripe.com/docs/api/checkout/sessions/object#checkout_session_object-id).",
    },
    limit: {
      type: "integer",
      label: "Number of Line Items",
      description: "The number of line items to retrieve (min: 1, max: 100)",
      default: 1,
      min: 1,
      max: 100,
    },
  },
  async run ({ $ }) {
    const {
      app,
      checkoutSessionId,
      limit,
    } = this;

    const resp = await app.sdk().checkout.sessions.listLineItems(checkoutSessionId, {
      limit,
    });
    $.export("$summary", `Successfully retrieved \`${resp.data.length}\` checkout session line items`);
    return resp;
  },
};
