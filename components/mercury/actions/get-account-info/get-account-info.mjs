import { ConfigurationError } from "@pipedream/platform";
import mercury from "../../mercury.app.mjs";
import { MAX_LIMIT } from "../../common/constants.mjs";

export default {
  key: "mercury-get-account-info",
  name: "Get Account Information",
  description: "Retrieve information (including balances) about a specific Mercury account by its ID. Mercury has no get-account-by-ID endpoint, so this pages through **List Accounts** and returns the account whose `id` matches. Run **List Accounts** first to obtain a valid account ID. The account ID is a UUID, not a prefixed string. Example: call with `account=\"69c8b0ee-8b87-11f1-a9e5-e7cd8f0e3f51\"` -> returns that account's full record `{ id, name, currentBalance, availableBalance, type, ... }`. [See the documentation](https://docs.mercury.com/reference/getaccounts)",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    mercury,
    account: {
      propDefinition: [
        mercury,
        "account",
      ],
    },
  },
  async run({ $ }) {
    let startAfter;
    let match;

    // Mercury exposes no /account/{id} lookup; page through /accounts (cursor is
    // the last account's id) until we find a match or run out of pages.
    while (!match) {
      const response = await this.mercury.getAccounts({
        $,
        params: {
          limit: MAX_LIMIT,
          start_after: startAfter,
        },
      });
      const accounts = response?.accounts ?? [];
      match = accounts.find((account) => account.id === this.account);
      if (match || accounts.length < MAX_LIMIT) {
        break;
      }
      startAfter = accounts[accounts.length - 1].id;
    }

    if (!match) {
      throw new ConfigurationError(`No account found with ID \`${this.account}\`. Run **List Accounts** to see valid account IDs.`);
    }

    $.export("$summary", `Successfully retrieved information for account: ${this.account}`);
    return match;
  },
};
