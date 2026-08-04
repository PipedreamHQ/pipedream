// x-pd-ai: optimized
import mercury from "../../mercury.app.mjs";
import {
  DEFAULT_LIMIT,
  MIN_LIMIT,
  MAX_LIMIT,
  TRANSACTION_STATUSES,
  ORDER,
} from "../../common/constants.mjs";

export default {
  key: "mercury-list-transactions",
  name: "List Transactions",
  description: "List transactions for a Mercury account, with optional date-range, search, status, and pagination filters. Run **List Accounts** first to obtain a valid account ID. Example: call with `accountId=\"acc_9f2a...\"`, `status=\"sent\"`, and `limit=10` -> returns `{ transactions: [{ id: \"txn_4b8c...\", amount: \"-42.00\", counterpartyName: \"AWS\", status: \"sent\", createdAt: \"2026-01-15T...\" }] }`. [See the documentation](https://docs.mercury.com/reference/listaccounttransactions)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    mercury,
    accountId: {
      propDefinition: [
        mercury,
        "account",
      ],
      label: "Account ID",
      description: "The account ID (UUID) whose transactions to list. Run **List Accounts** to obtain a valid ID.",
    },
    start: {
      type: "string",
      label: "Start Date",
      description: "Start date filter, `YYYY-MM-DD` or ISO 8601 (e.g. `2026-01-01`). Defaults to 30 days ago.",
      optional: true,
    },
    end: {
      type: "string",
      label: "End Date",
      description: "End date filter, `YYYY-MM-DD` or ISO 8601 (e.g. `2026-02-01`). Defaults to today.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of transactions to return. Min ${MIN_LIMIT}, max ${MAX_LIMIT}. Defaults to ${DEFAULT_LIMIT} if omitted.`,
      min: MIN_LIMIT,
      max: MAX_LIMIT,
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of transactions to skip for pagination. Must be >= 0.",
      min: 0,
      optional: true,
    },
    search: {
      type: "string",
      label: "Search",
      description: "Filter by transaction description or counterparty name.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter by status. One of `pending`, `sent`, `cancelled`, `failed`, `reversed`, `blocked`.",
      options: TRANSACTION_STATUSES,
      optional: true,
    },
    order: {
      type: "string",
      label: "Order",
      description: "Sort order by post time. `asc` or `desc` (default `desc`).",
      options: ORDER,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mercury.getTransactions({
      $,
      accountId: this.accountId,
      params: {
        limit: this.limit ?? DEFAULT_LIMIT,
        offset: this.offset,
        start: this.start,
        end: this.end,
        search: this.search,
        status: this.status,
        order: this.order,
      },
    });
    const transactions = response?.transactions ?? [];
    $.export("$summary", `Successfully retrieved ${transactions.length} transaction(s) for account ${this.accountId}`);
    return response;
  },
};
