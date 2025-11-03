import app from "../../stripe.app.mjs";

export default {
  key: "stripe-retrieve-checkout-session",
  name: "Retrieve a Checkout Session",
  type: "action",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "A Checkout Session represents your customer's session as they pay for one-time purchases or subscriptions through Stripe Checkout. [See the documentation](https://stripe.com/docs/api/checkout/sessions/retrieve).",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "checkoutSession",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const {
      app,
      id,
    } = this;
    const resp = await app.sdk().checkout.sessions.retrieve(id);
    $.export("$summary", `Successfully retrieved the checkout session with ID \`${resp.id}\`.`);
    return resp;
  },
};
