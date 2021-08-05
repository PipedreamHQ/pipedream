const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-list-payment-intents",
  name: "List Payment Intents",
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
      advanced: [
        stripe,
        "advanced",
      ],
      description: "Specify less-common options that you require. See [List all " +
        "PaymentIntents](https://stripe.com/docs/api/payment_intents/list) for a list of " +
        "supported options.",
    },
  },
  async run() {
    return await this.stripe.paginate(
      (params) => this.stripe.sdk().paymentIntents.list({
        ...pick(this, [
          "customer",
        ]),
        ...this.advanced,
        ...params,
      }),
    );
  },
};
