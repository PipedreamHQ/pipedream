import app from "../../huntress.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "huntress-list-agents",
  name: "List Agents",
  description: "List agents associated with your Huntress account. [See the documentation](https://api.huntress.io/docs#tag/agents/get/v1/agents)",
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
      optional: true,
      description: "Filter by organization ID within Huntress account.",
    },
    platform: {
      type: "string",
      label: "Platform",
      description: "Filter by platform.",
      optional: true,
      options: constants.AGENT_PLATFORM_OPTIONS,
    },
  },
  async run({ $ }) {
    const agents = await this.app.paginate({
      fn: this.app.listAgents.bind(this.app),
      fnArgs: {
        $,
        params: {
          organization_id: this.organizationId,
          platform: this.platform,
        },
      },
      keyField: "agents",
    });

    $.export("$summary", `Successfully retrieved \`${agents.length}\` agent(s)`);

    return agents;
  },
};
