import app from "../../pro_ledger.app.mjs";

export default {
  key: "pro_ledger-get-accounts",
  name: "Get Accounts",
  description: "Get accounts setup information. [See the documentation](https://api.pro-ledger.com/redoc#tag/record/operation/get_accounts_api_v1_record_get_accounts_get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getAccounts({
      $,
    });

    $.export("$summary", "Successfully retrieved accounts");

    return response;
  },
};
