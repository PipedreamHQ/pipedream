import { defineAction } from "@pipedream/types";
import app from "../../app/google_my_business.app";
import { ListAccountsParams } from "../../common/requestParams";
import { Account } from "../../common/responseSchemas";

const DOCS_LINK = "https://developers.google.com/my-business/reference/accountmanagement/rest/v1/accounts/list";

export default defineAction({
  key: "google_my_business-list-accounts",
  name: "List Accounts",
  description: `Lists all accounts accessible to the authenticated user. [See the documentation](${DOCS_LINK})`,
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    parentAccount: {
      type: "string",
      label: "Parent Account",
      description: "The resource name of the account for which the list of directly accessible accounts is to be retrieved. Format: `accounts/{account_id}`. If omitted, returns all accounts accessible to the authenticated user.",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "A filter constraining the accounts to return. Currently only supports filtering by `type` (e.g. `type=USER_GROUP`).",
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Number of accounts to return per page. Default and maximum is 20.",
      optional: true,
    },
    pageToken: {
      type: "string",
      label: "Page Token",
      description: "Token from a previous response to retrieve the next page of results.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      parentAccount, filter, pageSize, pageToken,
    } = this;

    const params: ListAccountsParams = {
      $,
      params: {
        parentAccount,
        filter,
        pageSize,
        pageToken,
      },
    };

    const response: { accounts?: Account[]; nextPageToken?: string; } = await this.app.listAccounts(params);
    const accounts = response?.accounts ?? [];

    $.export("$summary", `Successfully listed ${accounts.length} account${accounts.length !== 1
      ? "s"
      : ""}`);

    return response;
  },
});
