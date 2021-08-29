const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-retrieve-payout",
  name: "Retrieve a Payout",
  type: "action",
  version: "0.0.1",
  description: "Retrieves the details of an existing payout.",
  props: {
    stripe,
    id: {
      propDefinition: [
        stripe,
        "payout",
      ],
      optional: false,
    },
  },
  async run() {
    return await this.stripe.sdk().payouts.retrieve(this.id);
  },
};
