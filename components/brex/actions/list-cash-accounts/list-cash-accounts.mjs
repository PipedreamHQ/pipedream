// x-pd-ai: optimized
import brexApp from "../../brex.app.mjs";
import { formatSearchSummary } from "../../common/utils.mjs";

export default {
  key: "brex-list-cash-accounts",
  name: "List Cash Accounts",
  description: "Lists the Brex cash accounts with their balances, account and routing numbers, and which one is primary. Results are capped at `maxResults` (default `100`) — check `$summary` for a truncation notice and raise `maxResults` if it's truncated. This is how you find the account ID that **List Transactions for Selected Cash Account** requires. [See the documentation](https://developer.brex.com/openapi/transactions_api/accounts/listaccounts)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    brexApp,
    maxResults: {
      propDefinition: [
        brexApp,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const {
      items, truncated,
    } = await this.brexApp.listCashAccountsPaginated({
      $,
      max: this.maxResults,
    });

    $.export("$summary", formatSearchSummary({
      count: items.length,
      noun: "cash account(s)",
      truncated,
    }));

    return items;
  },
};
