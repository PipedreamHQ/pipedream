const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-list-refunds",
  name: "List Refunds",
  type: "action",
  version: "0.0.1",
  description: "Find or list refunds",
  props: {
    stripe,
    charge: {
      propDefinition: [
        stripe,
        "charge",
      ],
    },
    payment_intent: {
      propDefinition: [
        stripe,
        "payment_intent",
      ],
    },
    limit: {
      propDefinition: [
        stripe,
        "limit",
      ],
    },
  },
  async run() {
    const params = pick(this, [
      "charge",
      "payment_intent",
    ]);
    return await this.stripe.sdk().refunds.list(params)
      .autoPagingToArray({
        limit: this.limit,
      });
  },
};
