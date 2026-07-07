import app from "../../linkupapi.app.mjs";
import { ACCOUNTS_MAX_PAGE_SIZE } from "../../common/constants.mjs";

export default {
  key: "linkupapi-list-accounts",
  name: "List Accounts",
  description: "List the LinkupAPI accounts connected to your API key, each with its persistent `account_id` to use in other actions. Paginates automatically up to **Total Results**. [See the documentation](https://docs.linkupapi.com/api-reference/v2/accounts/list-accounts)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    totalResults: {
      propDefinition: [
        app,
        "totalResults",
      ],
    },
  },
  async run({ $ }) {
    const max = this.totalResults;
    const accounts = [];
    let offset = 0;
    let items = [];
    let total = 0;

    do {
      const limit = Math.min(ACCOUNTS_MAX_PAGE_SIZE, max - accounts.length);
      const { data } = await this.app.listAccounts({
        $,
        params: {
          limit,
          offset,
        },
      });

      items = data?.items || [];
      accounts.push(...items);
      offset += items.length;
      total = data?.total || 0;
    } while (items.length && accounts.length < max && offset < total);

    $.export("$summary", `Successfully retrieved ${accounts.length} account${accounts.length === 1
      ? ""
      : "s"}`);
    return accounts;
  },
};
