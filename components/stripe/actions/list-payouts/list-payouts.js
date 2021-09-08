const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-list-payouts",
  name: "List Payouts",
  type: "action",
  version: "0.0.1",
  description: "Find or list payouts",
  props: {
    stripe,
    status: {
      propDefinition: [
        stripe,
        "payout_status",
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
      "status",
    ]);
    return await this.stripe.sdk().payouts.list(params)
      .autoPagingToArray({
        limit: this.limit,
      });
  },
};
