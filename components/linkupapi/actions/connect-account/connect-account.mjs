import app from "../../linkupapi.app.mjs";
import { DEFAULT_PLATFORM } from "../../common/constants.mjs";

export default {
  key: "linkupapi-connect-account",
  name: "Connect Account",
  description: "Authenticate a LinkedIn account and obtain a persistent `account_id` to reuse across all other actions. Run this once, then copy the returned `account_id` into the **Account ID** prop of every other LinkupAPI action. If a checkpoint/challenge is required, follow up with **Verify Code**. [See the documentation](https://docs.linkupapi.com/api-reference/v2/accounts/login)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
      optional: false,
    },
    password: {
      propDefinition: [
        app,
        "password",
      ],
      optional: false,
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    accountName: {
      type: "string",
      label: "Account Name",
      description: "Optional human-readable display name for the connected account.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.connectAccount({
      $,
      data: {
        email: this.email,
        password: this.password,
        country: this.country,
        account_name: this.accountName,
        platform: DEFAULT_PLATFORM,
      },
    });

    $.export("$summary", `Successfully connected account${response.data?.account_id
      ? `: ${response.data.account_id}`
      : ""}`);
    return response;
  },
};
