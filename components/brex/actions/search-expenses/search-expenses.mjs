import { ConfigurationError } from "@pipedream/platform";
import brexApp from "../../brex.app.mjs";
import options from "../../common/options.mjs";
import { formatSearchSummary } from "../../common/utils.mjs";

export default {
  key: "brex-search-expenses",
  name: "Search Expenses",
  description: "Searches expenses across card, bill pay, and reimbursement spend by merchant, amount, date, person, type, or status. Covers every payment method and carries receipt and approval state; use **Search Card Transactions** for settled card postings only. [See the documentation](https://developer.brex.com/openapi/expenses_api/expenses/listexpenses)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    brexApp,
    purchasedAtStart: {
      type: "string",
      label: "Purchased At Start",
      description: "Only return expenses purchased on or after this date-time, in [RFC 3339](https://tools.ietf.org/html/rfc3339#section-5.6) format, e.g. `2024-01-01T00:00:00.000`.",
      optional: true,
    },
    purchasedAtEnd: {
      type: "string",
      label: "Purchased At End",
      description: "Only return expenses purchased on or before this date-time, in [RFC 3339](https://tools.ietf.org/html/rfc3339#section-5.6) format, e.g. `2024-01-31T23:59:59.999`.",
      optional: true,
    },
    userIds: {
      propDefinition: [
        brexApp,
        "userIds",
      ],
      description: "Only return expenses belonging to these people. Use **List Users** to find a user ID by email address.",
    },
    expenseType: {
      type: "string[]",
      label: "Expense Type",
      description: "Only return expenses of these types.",
      options: options.expenseType,
      optional: true,
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Only return expenses in these approval states.",
      options: options.expenseStatus,
      optional: true,
    },
    paymentStatus: {
      type: "string[]",
      label: "Payment Status",
      description: "Only return expenses in these payment states.",
      options: options.expensePaymentStatus,
      optional: true,
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

    const merchantQuery = this.merchantQuery?.toLowerCase();
    const hasLocalFilter = Boolean(merchantQuery)
      || this.minAmount != null
      || this.maxAmount != null;

    const matches = (expense) => {
      const descriptor = expense.merchant?.raw_descriptor?.toLowerCase() ?? "";
      if (merchantQuery && !descriptor.includes(merchantQuery)) {
        return false;
      }
      const amount = expense.billing_amount?.amount;
      if (this.minAmount != null && !(amount >= this.minAmount)) {
        return false;
      }
      if (this.maxAmount != null && !(amount <= this.maxAmount)) {
        return false;
      }
      return true;
    };

    const {
      items, scanned, truncated,
    } = await this.brexApp.listExpensesPaginated({
      $,
      params: {
        "purchased_at_start": this.purchasedAtStart,
        "purchased_at_end": this.purchasedAtEnd,
        "user_id[]": this.userIds,
        "expense_type[]": this.expenseType,
        "status[]": this.status,
        "payment_status[]": this.paymentStatus,
        // Merchant matching reads `merchant.raw_descriptor`, which is only present when expanded.
        "expand[]": [
          "merchant",
          "user",
        ],
      },
      max: this.maxResults,
      filter: hasLocalFilter
        ? matches
        : undefined,
    });

    $.export("$summary", formatSearchSummary({
      count: items.length,
      noun: "expense(s)",
      scope: this.merchantQuery
        ? ` matching "${this.merchantQuery}"`
        : "",
      scanned,
      truncated,
    }));

    return items;
  },
};
