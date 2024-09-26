import app from "../../stripe.app.mjs";

export default {
  key: "stripe-retrieve-payment-intent",
  name: "Retrieve a Payment Intent",
  type: "action",
  version: "0.1.0",
  description: "Retrieves the details of a " +
    "[payment intent](https://stripe.com/docs/payments/payment-intents) that was previously " +
    "created. [See the docs](https://stripe.com/docs/api/payment_intents/retrieve) for more " +
    "information",
  props: {
    app,
    client_secret: {
      propDefinition: [
        app,
        "payment_intent_client_secret",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const resp = await this.app.sdk().paymentIntents.retrieve(this.client_secret);
    $.export("$summary", `Successfully retrieved the payment intent, "${resp.description || resp.id}"`);
    return resp;
  },
};
