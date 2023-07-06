import app from "../../nango.app.mjs";

export default {
  key: "nango-delete-connection",
  name: "Delete Connection",
  description: "Deletes a Connection. [See the Documentation](https://docs.nango.dev/api-reference/connection/delete)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    connectionId: {
      propDefinition: [
        app,
        "connectionId",
      ],
    },
    providerConfigKey: {
      propDefinition: [
        app,
        "providerConfigKey",
      ],
      async options() {
        const { configs } = await this.app.listIntegrations();
        return configs.map(({ unique_key: value }) => value);
      },
    },
  },
  methods: {
    deleteConnection({
      connectionId, ...args
    } = {}) {
      return this.app.delete({
        path: `/connection/${connectionId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      connectionId,
      providerConfigKey,
    } = this;

    const response = await this.deleteConnection({
      connectionId,
      params: {
        provider_config_key: providerConfigKey,
      },
    });

    step.export("$summary", `Deleted Connection ${connectionId}`);

    return response;
  },
};
