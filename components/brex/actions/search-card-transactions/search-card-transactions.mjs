// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import brexApp from "../../brex.app.mjs";
import {
  formatSearchSummary, matchesAmountAndMerchant,
} from "../../common/utils.mjs";

export default {
  key: "brex-search-card-transactions",
  name: "Search Card Transactions",
  description: "Searches settled card transactions across every card account by merchant, amount, date, or cardholder, and returns the `expense_id` that **Get Expense** needs to fetch a receipt. Unlike **List Transactions for Primary Card Account**, this filters and expands. [See the documentation](https://developer.brex.com/openapi/transactions_api/transactions/listprimarycardtransactions)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    brexApp,
    postedAtStart: {
      propDefinition: [
        brexApp,
        "postedAtStart",
      ],
    },
    postedAtEnd: {
      type: "string",
      label: "Posted At End",
      description: "Only return transactions posted on or before this date-time, in [RFC 3339](https://tools.ietf.org/html/rfc3339#section-5.6) format, e.g. `2024-01-31T23:59:59.999`. Brex has no server-side end date, so this is applied after fetching.",
      optional: true,
    },
    userIds: {
      propDefinition: [
        brexApp,
        "userIds",
      ],
      label: "Cardholders",
      description: "Only return transactions made by these people. Use **List Users** to find a user ID by email address.",
    },
    merchantQuery: {
      propDefinition: [
        brexApp,
        "merchantQuery",
      ],
    },
    minAmount: {
      propDefinition: [
        brexApp,
        "minAmount",
      ],
    },
    maxAmount: {
      propDefinition: [
        brexApp,
        "maxAmount",
      ],
    },
    maxResults: {
      propDefinition: [
        brexApp,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    if (this.minAmount != null && this.maxAmount != null && this.minAmount > this.maxAmount) {
      throw new ConfigurationError("Min Amount cannot be greater than Max Amount.");
    }

    const postedAtEnd = this.postedAtEnd
      ? new Date(this.postedAtEnd)
      : undefined;

    if (postedAtEnd && isNaN(postedAtEnd)) {
      throw new ConfigurationError("Posted At End is not a valid date-time.");
    }

    const hasLocalFilter = Boolean(this.merchantQuery)
      || Boolean(postedAtEnd)
      || this.minAmount != null
      || this.maxAmount != null;

    const matches = (transaction) => {
      if (postedAtEnd && new Date(transaction.posted_at_date) > postedAtEnd) {
        return false;
      }
      return matchesAmountAndMerchant({
        descriptor: transaction.merchant?.raw_descriptor ?? transaction.description,
        amount: transaction.amount?.amount,
        merchantQuery: this.merchantQuery,
        minAmount: this.minAmount,
        maxAmount: this.maxAmount,
      });
    };

    const {
      items, scanned, truncated,
    } = await this.brexApp.listCardTransactionsPaginated({
      $,
      params: {
        "posted_at_start": this.postedAtStart,
        "user_ids": this.userIds,
        // Carries the bridge from a card posting to the expense holding its receipt.
        "expand[]": [
          "expense_id",
        ],
      },
      max: this.maxResults,
      filter: hasLocalFilter
        ? matches
        : undefined,
    });

    $.export("$summary", formatSearchSummary({
      count: items.length,
      noun: "transaction(s)",
      scope: this.merchantQuery
        ? ` matching "${this.merchantQuery}"`
        : "",
      scanned,
      truncated,
    }));

    return items;
  },
};
