import app from "../../huntress.app.mjs";

export default {
  key: "huntress-find-agents-by-organization",
  name: "Find Agents by Organization",
  description: "List agents within a specific organization in your Huntress account. [See the documentation](https://api.huntress.io/docs#tag/agents/get/v1/agents)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
  },
  async run({ $ }) {
    const agents = await this.app.paginate({
      fn: this.app.listAgents.bind(this.app),
      fnArgs: {
        $,
        params: {
          organization_id: this.organizationId,
        },
      },
      keyField: "agents",
    });

    $.export("$summary", `Successfully retrieved \`${agents.length}\` agent(s) for organization \`${this.organizationId}\``);

    return agents;
  },
};
