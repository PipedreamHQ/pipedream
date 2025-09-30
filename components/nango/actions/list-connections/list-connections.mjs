import app from "../../nango.app.mjs";

export default {
  key: "nango-list-connections",
  name: "List Connections",
  description: "Returns a list of Connections. [See the Documentation](https://docs.nango.dev/api-reference/connection/list)",
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
    const response = await this.app.listConnections();

    step.export("$summary", `Successfully retrieved ${response.connections.length} connections.`);

    return response;
  },
};
