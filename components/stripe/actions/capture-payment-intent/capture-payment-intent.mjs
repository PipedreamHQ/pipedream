import pick from "lodash.pick";
import app from "../../stripe.app.mjs";

export default {
  key: "stripe-capture-payment-intent",
  name: "Capture a Payment Intent",
  type: "action",
  version: "0.1.0",
  description: "Capture the funds of an existing uncaptured payment intent. [See the " +
  "docs](https://stripe.com/docs/api/payment_intents/capture) for more information",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "payment_intent",
      ],
      optional: false,
    },
    amount_to_capture: {
      propDefinition: [
        app,
        "amount",
      ],
      description: "The amount to capture, which must be less than or equal to the original " +
        "amount. Any additional amount will be automatically refunded. Defaults to the full " +
        "`amount_capturable` if not provided.",
    },
    advanced: {
      propDefinition: [
        app,
        "metadata",
      ],
      label: "Advanced Options",
      description: "Specify less-common options that you require. See [Capture a PaymentIntent]" +
        "(https://stripe.com/docs/api/payment_intents/capture) for a list of supported options.",
    },
  },
  async run({ $ }) {
    const params = pick(this, [
      "amount_to_capture",
    ]);
    const resp = await this.app.sdk().paymentIntents.capture(this.id, {
      ...params,
      ...this.advanced,
    });
    $.export("$summary", `Successfully captured ${params.amount_to_capture
      ? params.amount_to_capture
      : `the full ${resp.amount_capturable}`} from the payment intent`);
    return resp;
  },
};
