import app from "../../nango.app.mjs";
import providers from "../../common/providers.mjs";

export default {
  key: "nango-create-integration",
  name: "Create Integration",
  description: "Create a new Integration. [See the Documentation](https://docs.nango.dev/api-reference/integration/create)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    oauthClientId: {
      type: "string",
      label: "Client ID",
      description: "The Client ID of the Integration.",
    },
    oauthClientSecret: {
      type: "string",
      label: "Client Secret",
      description: "The Client Secret of the Integration.",
    },
    provider: {
      type: "string",
      label: "Provider",
      description: "The Provider of the Integration.",
      options() {
        return providers.getProviders();
      },
    },
    providerConfigKey: {
      propDefinition: [
        app,
        "providerConfigKey",
      ],
    },
    oauthScopes: {
      optional: true,
      propDefinition: [
        app,
        "oauthScopes",
        ({ provider }) => ({
          provider,
          getDefaultScopes: providers.getDefaultScopes,
        }),
      ],
    },
  },
  methods: {
    scopesToStr(scopes = "") {
      if (Array.isArray(scopes)) {
        return scopes.join(",");
      }
      return scopes;
    },
    createIntegration(args = {}) {
      return this.app.post({
        path: "/config",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      oauthClientId,
      oauthClientSecret,
      provider,
      providerConfigKey,
      oauthScopes,
    } = this;

    await this.createIntegration({
      step,
      data: {
        oauth_client_id: oauthClientId,
        oauth_client_secret: oauthClientSecret,
        provider,
        provider_config_key: providerConfigKey,
        oauth_scopes: this.scopesToStr(oauthScopes),
      },
    });

    step.export("$summary", "Successfully created Integration.");

    return {
      success: true,
      provider,
      providerConfigKey,
    };
  },
};
