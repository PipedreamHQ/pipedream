// x-pd-ai: optimized
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
  description: "Retrieve all Mercury bank accounts for the connected profile, including current and available balance fields. Use this first to discover account IDs needed by **List Transactions**, **Get Transaction**, and **Send Payment**. Serves the 'check balances across accounts' need since the accounts response already includes balance data. Example: call with no parameters -> returns `{ accounts: [{ id: \"acc_9f2a...\", name: \"Mercury Checking ••1234\", currentBalance: \"5000.00\", availableBalance: \"4800.00\" }] }`. [See the documentation](https://docs.mercury.com/reference/getaccounts)",
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
      description: "Cursor: return accounts created after this account ID (UUID). Obtain IDs from a prior run of this action.",
      optional: true,
    },
    endBefore: {
      type: "string",
      label: "End Before",
      description: "Cursor: return accounts created before this account ID (UUID).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mercury.getAccounts({
      $,
      params: {
        limit: this.limit ?? DEFAULT_LIMIT,
        order: this.order,
        startAfter: this.startAfter,
        endBefore: this.endBefore,
      },
    });
    const accounts = response?.accounts ?? [];
    $.export("$summary", `Successfully retrieved ${accounts.length} account(s)`);
    return response;
  },
};
