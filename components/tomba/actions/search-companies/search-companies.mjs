import app from "../../tomba.app.mjs";

export default {
  key: "tomba-search-companies",
  name: "Search Companies",
  description:
    "Search for companies using natural language queries or structured filters. The AI assistant will automatically generate appropriate filters from your query. [See the documentation](https://docs.tomba.io/api/reveal#search-companies)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "query",
      ],
      description:
        "Natural language query to search for companies (e.g., 'tech companies in San Francisco with 100+ employees')",
    },
    filters: {
      propDefinition: [
        app,
        "filters",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchCompanies({
      $,
      query: this.query,
      filters: this.filters,
      limit: this.limit,
      page: this.page,
    });

    $.export(
      "$summary",
      `Successfully searched companies with query: ${this.query}`,
    );
    return response;
  },
};
