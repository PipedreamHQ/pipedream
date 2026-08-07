// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import mercury from "../../mercury.app.mjs";
import {
  DEFAULT_LIMIT,
  MIN_LIMIT,
  MAX_LIMIT,
  ORDER,
} from "../../common/constants.mjs";

export default {
  key: "mercury-list-accounts",
  name: "List Accounts",
  description: "Retrieve a page of Mercury bank accounts for the connected profile (up to **Limit** per call, default 1000; pass the last account's ID as **Start After** to fetch later pages), including current and available balance fields (returned as numbers, not strings). Use this first to discover account IDs (each a UUID) needed by **List Transactions**, **Get Transaction**, and **Send Payment**. Serves the 'check balances across accounts' need since the accounts response already includes balance data. Example: call with no parameters -> returns `{ accounts: [{ id: \"69c8b0ee-8b87-11f1-a9e5-e7cd8f0e3f51\", name: \"Mercury Checking ••1234\", currentBalance: 5000, availableBalance: 4800.55 }] }`. [See the documentation](https://docs.mercury.com/reference/getaccounts)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    mercury,
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of accounts to return. Min ${MIN_LIMIT}, max ${MAX_LIMIT}. Defaults to ${DEFAULT_LIMIT} if omitted.`,
      min: MIN_LIMIT,
      max: MAX_LIMIT,
      optional: true,
    },
    order: {
      type: "string",
      label: "Order",
      description: "Sort order by creation time. One of `asc` or `desc` (default `asc`).",
      options: ORDER,
      optional: true,
    },
    startAfter: {
      type: "string",
      label: "Start After",
      description: "Cursor: return the page of accounts after this account ID (UUID) in the sorted results, e.g. `69c8b0ee-8b87-11f1-a9e5-e7cd8f0e3f51`. Use an account `id` from a previous **List Accounts** response. Mutually exclusive with **End Before** — provide only one.",
      optional: true,
    },
    endBefore: {
      type: "string",
      label: "End Before",
      description: "Cursor: return the page of accounts before this account ID (UUID) in the sorted results, e.g. `69c8b0ee-8b87-11f1-a9e5-e7cd8f0e3f51`. Use an account `id` from a previous **List Accounts** response. Mutually exclusive with **Start After** — provide only one.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.startAfter && this.endBefore) {
      throw new ConfigurationError("**Start After** and **End Before** are mutually exclusive — provide only one.");
    }
    const response = await this.mercury.getAccounts({
      $,
      params: {
        limit: this.limit ?? DEFAULT_LIMIT,
        order: this.order,
        start_after: this.startAfter,
        end_before: this.endBefore,
      },
    });
    const accounts = response?.accounts ?? [];
    $.export("$summary", `Successfully retrieved ${accounts.length} account(s)`);
    return response;
  },
};
