import pick from "lodash.pick";
import app from "../../stripe.app.mjs";

export default {
  key: "stripe-list-payment-intents",
  name: "List Payment Intents",
  type: "action",
  version: "0.1.0",
  description: "Retrieves a list of " +
    "[payment intent](https://stripe.com/docs/payments/payment-intents) that were previously " +
    "created. [See the docs](https://stripe.com/docs/api/payment_intents/list) for more " +
    "information",
  props: {
    app,
    customer: {
      propDefinition: [
        app,
        "customer",
      ],
    },
    advanced: {
      propDefinition: [
        app,
        "metadata",
      ],
      label: "Advanced Options",
      description: "Specify less-common options that you require. See [List all " +
        "PaymentIntents](https://stripe.com/docs/api/payment_intents/list) for a list of " +
        "supported options.",
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      ...pick(this, [
        "customer",
      ]),
      ...this.advanced,
    };
    const resp = await this.app.sdk().paymentIntents.list(params)
      .autoPagingToArray({
        limit: this.limit,
      });
    $.export("$summary", "Successfully fetched payment intents");
    return resp;
  },
};
