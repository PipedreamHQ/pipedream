import app from "../../stripe.app.mjs";

export default {
  key: "stripe-retrieve-payment-intent",
  name: "Retrieve a Payment Intent",
  type: "action",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieves the details of a payment intent that was previously created. [See the documentation](https://stripe.com/docs/api/payment_intents/retrieve).",
  props: {
    app,
    clientSecret: {
      propDefinition: [
        app,
        "paymentIntentClientSecret",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const {
      app,
      clientSecret,
    } =  this;

    const resp = await app.sdk().paymentIntents.retrieve(clientSecret);
    $.export("$summary", `Successfully retrieved the payment intent, \`${resp.description || resp.id}\`.`);
    return resp;
  },
};
