// x-pd-ai: optimized
import brexApp from "../../brex.app.mjs";
import { formatSearchSummary } from "../../common/utils.mjs";

export default {
  key: "brex-list-card-accounts",
  name: "List Card Accounts",
  description: "Lists the Brex card accounts, each with its current balance, available balance, account limit, and current statement period. These are account-level limits, not a single card's — use **Get Card** for that. Results are capped at `maxResults` (default `100`) — check `$summary` for a truncation notice and raise `maxResults` if it's truncated. [See the documentation](https://developer.brex.com/openapi/transactions_api/accounts/listcardaccounts)",
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
    } = await this.brexApp.listCardAccountsPaginated({
      $,
      max: this.maxResults,
    });

    $.export("$summary", formatSearchSummary({
      count: items.length,
      noun: "card account(s)",
      truncated,
    }));

    return items;
  },
};
