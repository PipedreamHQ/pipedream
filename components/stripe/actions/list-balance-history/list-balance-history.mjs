import app from "../../stripe.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "stripe-list-balance-history",
  name: "List Balance History",
  type: "action",
  version: "0.2.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "List all balance transactions. Returns up to `limit` transaction objects per call. To paginate, read `has_more` and `next_starting_after` from this step's exports — pass `next_starting_after` as the `Starting After` prop on the next call to fetch the next page. [See the documentation](https://stripe.com/docs/api/balance_transactions/list).",
  props: {
    app,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    alert: {
      type: "alert",
      alertType: "info",
      content: "Returns the last 100 transactions that have contributed to the Stripe account balance (e.g., charges, transfers, and so forth). The transactions are returned in sorted order, with the most recent transactions appearing first. [See the documentation](https://stripe.com/docs/api/balance_transactions/list).",
    },
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
      type: "string",
      label: "Transaction Type",
      description: "The type of transaction to return. If not specified, all transactions will be returned.",
      options: [
        "adjustment",
        "advance",
        "advance_funding",
        "anticipation_repayment",
        "application_fee",
        "application_fee_refund",
        "charge",
        "connect_collection_transfer",
        "contribution",
        "issuing_authorization_hold",
        "issuing_authorization_release",
        "issuing_dispute",
        "issuing_transaction",
        "payment",
        "payment_failure_refund",
        "payment_refund",
        "payout",
        "payout_cancel",
        "payout_failure",
        "refund",
        "refund_failure",
        "reserve_transaction",
        "reserved_funds",
        "stripe_fee",
        "stripe_fx_fee",
        "tax_fee",
        "topup",
        "topup_reversal",
        "transfer",
        "transfer_cancel",
        "transfer_failure",
        "transfer_refund",
      ],
      optional: true,
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

    // Fetch limit+1 internally to detect `has_more` accurately, then trim
    // back to `limit` before returning. This preserves the array return
    // shape while exposing pagination metadata via $.export.
    const allItems = await app.sdk().balanceTransactions.list({
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
        limit: limit + 1,
      });

    const hasMore = allItems.length > limit;
    const items = hasMore
      ? allItems.slice(0, limit)
      : allItems;
    const nextStartingAfter = hasMore
      ? items[items.length - 1]?.id
      : null;

    $.export("$summary", `Successfully fetched ${items.length} balance transaction${items.length === 1 ? "" : "s"}${hasMore ? " (more available)" : ""}`);
    $.export("has_more", hasMore);
    $.export("next_starting_after", nextStartingAfter);

    return items;
  },
};
