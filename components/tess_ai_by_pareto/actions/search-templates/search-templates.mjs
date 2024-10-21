import tess_ai_by_pareto from "../../tess_ai_by_pareto.app.mjs";

export default {
  key: "tess_ai_by_pareto-search-templates",
  name: "Search AI Templates",
  description: "Searches for AI templates created by users based on specific criteria. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    tess_ai_by_pareto,
    query: {
      propDefinition: [
        "tess_ai_by_pareto",
        "query",
      ],
    },
    typeFilter: {
      propDefinition: [
        "tess_ai_by_pareto",
        "typeFilter",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.tess_ai_by_pareto.searchAiTemplates({
      query: this.query,
      typeFilter: this.typeFilter,
    });
    $.export("$summary", `Found ${response.templates.length} templates`);
    return response;
  },
};
