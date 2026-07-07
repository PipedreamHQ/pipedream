import app from "../../linkupapi.app.mjs";

export default {
  type: "action",
  key: "linkupapi-verify-code",
  name: "Verify Code",
  description: "Submit a checkpoint/challenge verification code to complete authentication for a connected account. [See the documentation](https://docs.linkupapi.com/api-reference/v2/accounts/login)",
  version: "1.0.0",
  annotations: {
    readOnlyHint: false,
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
    code: {
      propDefinition: [
        app,
        "code",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.verifyCheckpoint({
      $,
      data: {
        account_id: this.accountId,
        code: this.code,
      },
    });

    $.export("$summary", `Successfully verified code for account ${this.accountId}`);
    return response;
  },
};
