const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-list-payment-intents",
  name: "List Payment Intents",
  type: "action",
  version: "0.0.1",
  description: "Retrieves a list of " +
    "[payment intent](https://stripe.com/docs/payments/payment-intents) that were previously " +
    "created",
  props: {
    stripe,
    customer: {
      propDefinition: [
        stripe,
        "customer",
      ],
    },
    advanced: {
      propDefinition: [
        stripe,
        "advanced",
      ],
      description: "Specify less-common options that you require. See [List all " +
        "PaymentIntents](https://stripe.com/docs/api/payment_intents/list) for a list of " +
        "supported options.",
    },
    limit: {
      propDefinition: [
        stripe,
        "limit",
      ],
    },
  },
  async run() {
    const params = {
      ...pick(this, [
        "customer",
      ]),
      ...this.advanced,
    };
    return await this.stripe.sdk().paymentIntents.list(params)
      .autoPagingToArray({
        limit: this.limit,
      });
  },
};
