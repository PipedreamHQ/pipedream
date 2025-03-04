import { createBackendClient } from "@pipedream/sdk/server";

export default {
  type: "app",
  app: "pipedream_connect",
  propDefinitions: {
    project_id: {
      type: "string",
      label: "Project ID",
      description: "The ID of your project in Pipedream (e.g., `proj_1234567`)",
    },
    environment: {
      type: "string",
      label: "Environment",
      description: "The Pipedream Connect environment. See [the docs](https://pipedream.com/docs/connect/environments) for more info.",
      options: [
        "development",
        "production",
      ],
    },
    external_user_id: {
      type: "string",
      label: "External User ID",
      description: "The ID of your end user. See [the docs](https://pipedream.com/docs/connect/managed-auth/users) for more info.",
      optional: true,
    },
    app_slug: {
      type: "string",
      label: "App Slug",
      description: "The app slug of the app. See [the docs](https://pipedream.com/docs/rest-api/#apps) for more info.",
      optional: true,
    },
    include_credentials: {
      type: "boolean",
      label: "Include Credentials",
      description: "Include the end users' credentials in the response. See [the docs](https://pipedream.com/docs/connect/api/#accounts) for more info.",
      optional: true,
    },
  },
  methods: {
    getClient({
      projectId, environment,
    }) {
      return createBackendClient({
        environment: environment,
        credentials: {
          clientId: this.$auth.client_id,
          clientSecret: this.$auth.client_secret,
        },
        projectId: projectId,
      });
    },
    async getAccounts({
      projectId, environment, app, externalUserId, includeCredentials,
    }) {
      const client = this.getClient({
        projectId,
        environment,
      });

      return client.getAccounts({
        app,
        external_user_id: externalUserId,
        include_credentials: includeCredentials,
      });
    },
    async createConnectToken({
      projectId,
      environment,
      external_user_id,
      webhook_uri,
      success_redirect_uri,
      error_redirect_uri,
      allowed_origins,
    }) {
      const client = this.getClient({
        projectId,
        environment,
      });

      return client.createConnectToken({
        external_user_id: external_user_id,
        webhook_uri: webhook_uri,
        success_redirect_uri: success_redirect_uri,
        error_redirect_uri: error_redirect_uri,
        allowed_origins: allowed_origins,
      });
    },
  },
};
