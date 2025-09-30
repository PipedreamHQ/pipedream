import app from "../../tess_ai_by_pareto.app.mjs";

export default {
  key: "tess_ai_by_pareto-search-ai-agents",
  name: "Search AI Agents",
  description:
    "Retrieve AI Agents (templates) that match the specified criteria. [See the documentation](https://tess.pareto.io/api/swagger#/default/201046139d07458d530ad3526e0b3c2f)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    query: {
      type: "string",
      label: "Search Query",
      description:
        "Search agents (templates) by title, description and long description.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type Filter",
      description: "Filter by template type",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
      default: 15,
      min: 1,
      max: 1000,
    },
  },
  async run({ $ }) {
    const response = await this.app.searchTemplates({
      $,
      params: {
        q: this.query,
        type: this.type,
        per_page: this.maxResults,
      },
    });
    $.export("$summary", `Retrieved ${response.data?.length} templates`);
    return response;
  },
};
