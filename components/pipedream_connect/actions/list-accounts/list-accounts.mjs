import pipedream_connect from "../../pipedream_connect.app.mjs";

export default {
  name: "List External User Accounts",
  version: "0.0.1",
  key: "pipedream_connect-list-accounts",
  description: "List connected accounts for end users within a project. [See the docs](https://pipedream.com/docs/connect/api/#list-all-accounts) for more info.",
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
    },
    app_slug: {
      propDefinition: [
        pipedream_connect,
        "app_slug",
      ],
    },
    include_credentials: {
      propDefinition: [
        pipedream_connect,
        "include_credentials",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pipedream_connect.getAccounts({
      $,
      projectId: this.project_id,
      environment: this.environment,
      app: this.app_slug,
      externalUserId: this.external_user_id,
      includeCredentials: this.include_credentials,
    });

    $.export("$summary", `Successfully fetched ${response.data.length || 0} ${response.data.length === 1
      ? "account"
      : "accounts"}`);

    return response;
  },
};
