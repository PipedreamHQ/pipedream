import { ConfigurationError } from "@pipedream/platform";
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
  description: "List all balance transactions. By default returns an array of transaction objects (auto-paginated up to `Limit`). Set `Return Pagination Info` to true to instead receive `{ data, has_more, next_starting_after }` for a single Stripe page (max 100 per call) — pass `next_starting_after` as `Starting After` on the next call to iterate. [See the documentation](https://stripe.com/docs/api/balance_transactions/list).",
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
      description: "Maximum records to return. Auto-paginated up to 10000 by default; capped at 100 when `Return Pagination Info` is enabled (Stripe's per-call limit).",
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
    returnPaginationInfo: {
      propDefinition: [
        app,
        "returnPaginationInfo",
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
      returnPaginationInfo,
    } = this;

    if (returnPaginationInfo && limit > 100) {
      throw new ConfigurationError("When `Return Pagination Info` is enabled, `Limit` must be 100 or fewer (Stripe caps single-page responses at 100). Disable the flag to auto-paginate up to 10000 results, or set Limit ≤ 100.");
    }

    if (startingAfter && endingBefore) {
      throw new ConfigurationError("Use either `Starting After` or `Ending Before`, not both.");
    }

    const params = {
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
    };

    const result = await app.paginate({
      collection: "balanceTransactions",
      params,
      limit,
      returnPaginationInfo,
    });

    const items = returnPaginationInfo
      ? result.data
      : result;
    const count = items.length;
    const noun = count === 1
      ? "balance transaction"
      : "balance transactions";
    const moreSuffix = returnPaginationInfo && result.has_more
      ? " (more available)"
      : "";
    $.export("$summary", `Successfully fetched ${count} ${noun}${moreSuffix}`);

    return result;
  },
};
