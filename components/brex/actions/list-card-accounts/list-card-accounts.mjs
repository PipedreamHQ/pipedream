import brexApp from "../../brex.app.mjs";
import { formatMoney } from "../../utils.mjs";

export default {
  key: "brex-list-card-accounts",
  name: "List Card Accounts",
  description: "Retrieves the card account with its current balance, available balance, account limit, and current statement period. This is the account-level limit, not a single card's — use **Get Card** for that. [See the documentation](https://developer.brex.com/openapi/transactions_api/accounts/listcardaccounts)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    brexApp,
  },
  async run({ $ }) {
    const account = await this.brexApp.listCardAccounts({
      $,
    });

    const balance = formatMoney(account.current_balance) ?? "an unknown balance";
    const available = formatMoney(account.available_balance) ?? "unknown";

    $.export(
      "$summary",
      `Card account ${account.id} — ${balance} owed, ${available} available`,
    );

    return account;
  },
};
