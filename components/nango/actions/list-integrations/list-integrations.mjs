import app from "../../nango.app.mjs";

export default {
  key: "nango-list-integrations",
  name: "List Integrations",
  description: "Returns a list of Integrations. [See the Documentation](https://docs.nango.dev/api-reference/integration/list)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $: step }) {
    const response = await this.app.listIntegrations();

    step.export("$summary", `Successfully retrieved ${response.configs.length} integrations.`);

    return response;
  },
};
