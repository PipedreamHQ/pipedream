const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-list-refunds",
  name: "List Refunds",
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
  },
  async run() {
    return await this.stripe.paginate(
      (params) => this.stripe.sdk().refunds.list({
        ...pick(this, [
          "charge",
          "payment_intent",
        ]),
        ...params,
      }),
    );
  },
};
