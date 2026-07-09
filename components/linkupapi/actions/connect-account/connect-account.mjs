import { ConfigurationError } from "@pipedream/platform";
import app from "../../linkupapi.app.mjs";
import { DEFAULT_PLATFORM } from "../../common/constants.mjs";

export default {
  key: "linkupapi-connect-account",
  name: "Connect Account",
  description: "Authenticate a LinkedIn account and obtain a persistent `account_id` to reuse across all other actions. Connect with either a login token or email + password. If a checkpoint/challenge is required, follow up with **Verify Code**. [See the documentation](https://docs.linkupapi.com/api-reference/v2/accounts/login)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    loginToken: {
      type: "string",
      label: "Login Token",
      description: "LinkedIn authentication token/cookie for direct, token-based connection. Alternative to Email + Password that skips the 2FA step. Provide this, or both **Email** and **Password**.",
      secret: true,
      optional: true,
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
      description: "Account email address. Required (with **Password**) for credential-based login when no **Login Token** is provided.",
    },
    password: {
      propDefinition: [
        app,
        "password",
      ],
      description: "Account password. Required (with **Email**) for credential-based login when no **Login Token** is provided.",
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
      description: "Display name for the account. Defaults to the email address.",
      optional: true,
    },
    challengeType: {
      type: "string",
      label: "Challenge Type",
      description: "Type of 2FA challenge to use if the account has two-factor authentication enabled. `code_challenge`: receive a verification code (email/SMS/authenticator) to submit via **Verify Code**. `app_challenge`: approve the login from the LinkedIn mobile app, then call **Verify Code** with only the account ID.",
      optional: true,
      options: [
        "code_challenge",
        "app_challenge",
      ],
    },
  },
  async run({ $ }) {
    if (!this.loginToken && !(this.email && this.password)) {
      throw new ConfigurationError("Provide a **Login Token**, or both **Email** and **Password**, to connect an account.");
    }
    const response = await this.app.connectAccount({
      $,
      data: {
        platform: DEFAULT_PLATFORM,
        email: this.email,
        password: this.password,
        login_token: this.loginToken,
        country: this.country,
        account_name: this.accountName,
        challenge_type: this.challengeType,
      },
    });

    $.export("$summary", `Successfully connected account${response.data?.account_id
      ? `: ${response.data.account_id}`
      : ""}`);
    return response;
  },
};
