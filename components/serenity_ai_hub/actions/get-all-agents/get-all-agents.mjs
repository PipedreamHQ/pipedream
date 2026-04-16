import app from "../../serenity_ai_hub.app.mjs";

export default {
  key: "serenity_ai_hub-get-all-agents",
  name: "Get All Agents",
  description: "Gets a list containing all agents. [See the documentation](https://docs.serenitystar.ai/docs/api/aihub/get-all-agents)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    term: {
      type: "string",
      label: "Search Term",
      description: "Filter agents by a search term",
      optional: true,
    },
    culture: {
      propDefinition: [
        app,
        "culture",
      ],
    },
    max: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of agents to return. Defaults to `100`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      max,
      term,
      culture,
    } = this;

    const agents = await app.getPaginatedResources({
      resourcesFn: app.getAllAgents,
      resourcesFnArgs: {
        $,
        params: {
          term,
          culture,
        },
      },
      max,
    });

    $.export("$summary", `Successfully retrieved \`${agents.length}\` agent(s)`);
    return agents;
  },
};
