import dataforb2b from "../../dataforb2b.app.mjs";

export default {
  key: "dataforb2b-agent-search",
  name: "Agentic Search",
  description: "Use natural language to search people or companies. The AI interprets your query and applies filters automatically. [See the documentation](https://docs.dataforb2b.ai/api-reference/agent-search)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dataforb2b,
    query: {
      propDefinition: [
        dataforb2b,
        "query",
      ],
    },
    category: {
      propDefinition: [
        dataforb2b,
        "category",
      ],
    },
    lookalikeUseCase: {
      propDefinition: [
        dataforb2b,
        "lookalikeUseCase",
      ],
    },
    count: {
      propDefinition: [
        dataforb2b,
        "count",
      ],
      default: 25,
      description: "Number of results to return (default: 25, max: 100).",
    },
    enrichLive: {
      propDefinition: [
        dataforb2b,
        "enrichLive",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dataforb2b.agentSearch({
      $,
      data: {
        query: this.query,
        category: this.category,
        lookalike_use_case: this.lookalikeUseCase,
        count: this.count,
        enrich_live: this.enrichLive,
      },
    });

    $.export("$summary", `Agentic search returned ${response.count} results`);
    return response;
  },
};
