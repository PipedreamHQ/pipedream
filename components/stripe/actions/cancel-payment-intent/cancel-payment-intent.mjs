import pick from "lodash.pick";
import app from "../../stripe.app.mjs";

export default {
  key: "stripe-cancel-payment-intent",
  name: "Cancel a Payment Intent",
  type: "action",
  version: "0.1.0",
  description: "Cancel a [payment intent](https://stripe.com/docs/payments/payment-intents). " +
    "Once canceled, no additional charges will be made by the payment intent and any operations " +
    "on the payment intent will fail with an error. For payment intents with status=" +
    "`requires_capture`, the remaining amount_capturable will automatically be refunded. [See the" +
    " docs](https://stripe.com/docs/api/payment_intents/cancel) for more information",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "payment_intent",
      ],
      optional: false,
    },
    cancellation_reason: {
      propDefinition: [
        app,
        "payment_intent_cancellation_reason",
      ],
    },
  },
  async run({ $ }) {
    const params = pick(this, [
      "cancellation_reason",
    ]);
    const resp = await this.app.sdk().paymentIntents.cancel(this.id, params);
    $.export("$summary", "Successfully cancelled payment intent");
    return resp;
  },
};
