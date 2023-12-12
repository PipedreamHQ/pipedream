const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-list-balance-history",
  name: "List Balance History",
  type: "action",
  version: "0.0.2",
  description: "Returns the last 100 transactions that have contributed to the Stripe account " +
    "balance (e.g., charges, transfers, and so forth). The transactions are returned in " +
    "sorted order, with the most recent transactions appearing first. [See the " +
    "docs](https://stripe.com/docs/api/balance_transactions/list) for more information",
  props: {
    stripe,
    payout: {
      propDefinition: [
        stripe,
        "payout",
      ],
    },
    currency: {
      propDefinition: [
        stripe,
        "currency",
      ],
    },
    type: {
      propDefinition: [
        stripe,
        "balance_transaction_type",
      ],
    },
    limit: {
      propDefinition: [
        stripe,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const params = pick(this, [
      "payout",
      "type",
    ]);
    const resp = await this.stripe.sdk().balanceTransactions.list(params)
      .autoPagingToArray({
        limit: this.limit,
      });
    $.export("$summary", "Successfully fetched balance transactions");
    return resp;
  },
};
