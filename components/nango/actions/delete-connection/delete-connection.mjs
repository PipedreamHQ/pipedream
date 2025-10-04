import app from "../../nango.app.mjs";

export default {
  key: "nango-delete-connection",
  name: "Delete Connection",
  description: "Deletes a Connection. [See the Documentation](https://docs.nango.dev/api-reference/connection/delete)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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

    await this.deleteConnection({
      connectionId,
      params: {
        provider_config_key: providerConfigKey,
      },
    });

    step.export("$summary", `Deleted Connection with ID ${connectionId}.`);

    return {
      success: true,
      connectionId,
    };
  },
};
