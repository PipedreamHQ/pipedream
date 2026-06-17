import servicenow from "../../servicenow.app.mjs";
import constants from "../../common/constants.mjs";

const { MAX_LIMIT } = constants;

export default {
  key: "servicenow-search-knowledge-base",
  name: "Search Knowledge Base",
  description: "Search ServiceNow knowledge base articles via the Knowledge Management API (requires the `sn_km_api` plugin). Returns matching articles with snippets; retrieve a full article body by its id with **Get Table Records** on `kb_knowledge` or the article detail endpoint. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_KnowledgeManagementAPI.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    query: {
      type: "string",
      label: "Query",
      description: "Free-text search term to match knowledge articles (maps to `query`). Example: `vpn setup`.",
    },
    limit: {
      propDefinition: [
        servicenow,
        "limit",
      ],
      description: `Maximum number of articles to return (maps to \`limit\`). Min 1, max ${MAX_LIMIT}.`,
    },
  },
  async run({ $ }) {
    const response = await this.servicenow.searchKnowledgeArticles({
      $,
      params: {
        query: this.query,
        limit: this.limit,
      },
    });

    const articles = Array.isArray(response)
      ? response
      : (response?.articles ?? []);
    $.export("$summary", `Found ${articles.length} knowledge article(s) matching "${this.query}"`);

    return response;
  },
};
