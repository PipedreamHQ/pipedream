import app from "../../stripe.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "stripe-list-balance-history",
  name: "List Balance History",
  type: "action",
  version: "0.1.6",
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
        () => ({
          country: "US",
        }),
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
    createdGt: {
      propDefinition: [
        app,
        "createdGt",
      ],
    },
    createdGte: {
      propDefinition: [
        app,
        "createdGte",
      ],
    },
    createdLt: {
      propDefinition: [
        app,
        "createdLt",
      ],
    },
    createdLte: {
      propDefinition: [
        app,
        "createdLte",
      ],
    },
    endingBefore: {
      propDefinition: [
        app,
        "endingBefore",
      ],
    },
    startingAfter: {
      propDefinition: [
        app,
        "startingAfter",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      payout,
      type,
      currency,
      limit,
      createdGt,
      createdGte,
      createdLt,
      createdLte,
      endingBefore,
      startingAfter,
    } = this;

    const resp = await app.sdk().balanceTransactions.list({
      payout,
      type,
      currency,
      ending_before: endingBefore,
      starting_after: startingAfter,
      ...(createdGt || createdGte || createdLt || createdLte
        ? {
          created: {
            gt: utils.fromDateToInteger(createdGt),
            gte: utils.fromDateToInteger(createdGte),
            lt: utils.fromDateToInteger(createdLt),
            lte: utils.fromDateToInteger(createdLte),
          },
        }
        : {}
      ),
    })
      .autoPagingToArray({
        limit,
      });
    $.export("$summary", "Successfully fetched balance transactions");
    return resp;
  },
};
