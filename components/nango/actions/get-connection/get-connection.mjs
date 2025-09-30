import app from "../../nango.app.mjs";

export default {
  key: "nango-get-connection",
  name: "Get Connection",
  description: "Returns a Connection. [See the Documentation](https://docs.nango.dev/api-reference/connection/get)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    connectionId: {
      propDefinition: [
        app,
        "connectionId",
      ],
    },
    providerConfigKey: {
      description: "The Provider Config Key of the connection.",
      propDefinition: [
        app,
        "providerConfigKey",
      ],
    },
    forceRefresh: {
      type: "boolean",
      label: "Force Refresh",
      description: "Force a refresh of the Connection.",
      optional: true,
    },
    refreshToken: {
      type: "string",
      label: "Refresh Token",
      description: "The Refresh Token of the Connection.",
      optional: true,
    },
  },
  methods: {
    getConnection({
      connectionId, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/connection/${connectionId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      connectionId,
      providerConfigKey,
      forceRefresh,
      refreshToken,
    } = this;

    const response = await this.getConnection({
      connectionId,
      params: {
        provider_config_key: providerConfigKey,
        force_refresh: forceRefresh,
        refresh_token: refreshToken,
      },
    });

    step.export("$summary", `Successfully retrieved connection with ID ${response.id}.`);

    return response;
  },
};
