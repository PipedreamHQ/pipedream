import pick from "lodash.pick";
import app from "../../stripe.app.mjs";

export default {
  key: "stripe-list-balance-history",
  name: "List Balance History",
  type: "action",
  version: "0.1.0",
  description: "Returns the last 100 transactions that have contributed to the Stripe account " +
    "balance (e.g., charges, transfers, and so forth). The transactions are returned in " +
    "sorted order, with the most recent transactions appearing first. [See the " +
    "docs](https://stripe.com/docs/api/balance_transactions/list) for more information",
  props: {
    app,
    payout: {
      propDefinition: [
        app,
        "payout",
      ],
    },
    currency: {
      propDefinition: [
        app,
        "currency",
      ],
    },
    type: {
      propDefinition: [
        app,
        "balance_transaction_type",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const params = pick(this, [
      "payout",
      "type",
    ]);
    const resp = await this.app.sdk().balanceTransactions.list(params)
      .autoPagingToArray({
        limit: this.limit,
      });
    $.export("$summary", "Successfully fetched balance transactions");
    return resp;
  },
};
