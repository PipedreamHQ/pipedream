const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-list-payouts",
  name: "List Payouts",
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
  },
  async run() {
    return await this.stripe.paginate(
      (params) => this.stripe.sdk().payouts.list({
        ...pick(this, [
          "status",
        ]),
        ...params,
      }),
    );
  },
};
