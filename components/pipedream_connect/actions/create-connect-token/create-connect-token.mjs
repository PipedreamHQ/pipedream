import pipedream_connect from "../../pipedream_connect.app.mjs";

export default {
  name: "Create a Connect Token and Link URL",
  version: "0.0.1",
  key: "pipedream_connect-create-connect-token",
  description: "Create a Connect token to use for subsequent requests in the Connect API, or to generate a Connect Link URL. [See the docs](https://pipedream.com/docs/connect/managed-auth/tokens/) for more info.",
  type: "action",
  props: {
    pipedream_connect,
    project_id: {
      propDefinition: [
        pipedream_connect,
        "project_id",
      ],
    },
    environment: {
      propDefinition: [
        pipedream_connect,
        "environment",
      ],
    },
    external_user_id: {
      propDefinition: [
        pipedream_connect,
        "external_user_id",
      ],
      optional: false,
    },
    webhook_uri: {
      type: "string",
      label: "Webhook URI",
      description: "Receive success and error events from the auth flow for your users",
      optional: true,
    },
    success_redirect_uri: {
      type: "string",
      label: "Success Redirect URI",
      description: "When using Connect Link, redirect the user to this URL after successful completing the auth flow. [See docs here](https://pipedream.com/docs/connect/managed-auth/connect-link/).",
      optional: true,
    },
    error_redirect_uri: {
      type: "string",
      label: "Error Redirect URI",
      description: "When using Connect Link, redirect the user to this URL upon failing to complete the auth flow. [See docs here](https://pipedream.com/docs/connect/managed-auth/connect-link/).",
      optional: true,
    },
    allowed_origins: {
      type: "string[]",
      label: "Allowed Origins",
      description: "When sending requests to the Connect API from a client browser, you must specify the allowed origins for the token. [See docs here](https://pipedream.com/docs/connect/api/#create-a-new-token).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pipedream_connect.createConnectToken({
      $,
      projectId: this.project_id,
      environment: this.environment,
      external_user_id: this.external_user_id,
      webhook_uri: this.webhook_uri,
      success_redirect_uri: this.success_redirect_uri,
      error_redirect_uri: this.error_redirect_uri,
      allowed_origins: this.allowed_origins,
    });

    $.export("$summary", "Successfully created a Connect token");

    return response;
  },
};
