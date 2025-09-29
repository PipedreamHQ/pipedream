import app from "../../stripe.app.mjs";

export default {
  key: "stripe-cancel-payment-intent",
  name: "Cancel A Payment Intent",
  type: "action",
  version: "0.1.3",
  description: "Cancel a PaymentIntent. [See the documentation](https://stripe.com/docs/payments/payment-intents).",
  props: {
    app,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    alert: {
      type: "alert",
      alertType: "info",
      content: "Once canceled, no additional charges will be made by the payment intent and any operations on the payment intent will fail with an error. For payment intents with `status=requires_capture`, the remaining amount_capturable will automatically be refunded. [See the documentation](https://stripe.com/docs/api/payment_intents/cancel).",
    },
    id: {
      propDefinition: [
        app,
        "paymentIntent",
      ],
      optional: false,
    },
    cancellationReason: {
      propDefinition: [
        app,
        "paymentIntentCancellationReason",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      id,
      cancellationReason,
    } = this;

    const resp = await app.sdk().paymentIntents.cancel(id, {
      cancellation_reason: cancellationReason,
    });
    $.export("$summary", "Successfully cancelled payment intent");
    return resp;
  },
};
