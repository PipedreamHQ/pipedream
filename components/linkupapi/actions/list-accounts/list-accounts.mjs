import app from "../../linkupapi.app.mjs";
import { ACCOUNTS_MAX_PAGE_SIZE } from "../../common/constants.mjs";

export default {
  key: "linkupapi-list-accounts",
  name: "List Accounts",
  description: "List the LinkupAPI accounts connected to your API key, each with its persistent `account_id` to use in other actions. [See the documentation](https://docs.linkupapi.com/api-reference/v2/accounts/list-accounts)",
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
    const accounts = await this.app._paginate({
      max: this.totalResults,
      requestPage: ({
        next, count,
      }) => this.app.listAccounts({
        $,
        params: {
          limit: Math.min(ACCOUNTS_MAX_PAGE_SIZE, count),
          offset: next || 0,
        },
      }),
      getItems: (res) => res.data?.items,
      getNext: (res) => {
        const data = res.data || {};
        const nextOffset = (data.offset || 0) + (data.items?.length || 0);
        return nextOffset < (data.total || 0)
          ? nextOffset
          : null;
      },
    });

    $.export("$summary", `Successfully retrieved ${accounts.length} account${accounts.length === 1
      ? ""
      : "s"}`);
    return accounts;
  },
};
