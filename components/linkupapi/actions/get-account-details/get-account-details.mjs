import app from "../../linkupapi.app.mjs";

export default {
  key: "linkupapi-get-account-details",
  name: "Get Account Details",
  description: "Retrieve details (status, active flag, platform, associated LinkedIn identifier, timestamps) for a connected LinkupAPI account. [See the documentation](https://docs.linkupapi.com/api-reference/v2/accounts/get-account)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getAccountDetails({
      $,
      accountId: this.accountId,
    });

    $.export("$summary", `Successfully retrieved details for account ${this.accountId}`);
    return response;
  },
};
