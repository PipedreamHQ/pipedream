import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-search-knowledge-base",
  name: "Search Knowledge Base",
  description: "Search ServiceNow knowledge base articles via the Knowledge Management API. Returns matching articles with snippets only; use **Get Article** to fetch an article's full HTML body. Optionally restrict the search to specific knowledge bases (run **List Knowledge Bases** to find their `sys_id`s). Requires the Knowledge API (`sn_km_api`) plugin, which is not active by default. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/knowledge-api.html)",
  version: "0.1.0",
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
    knowledgeBaseIds: {
      type: "string[]",
      label: "Knowledge Base IDs",
      description: "Restrict the search to these knowledge bases, by `sys_id` (maps to `kb`). Run **List Knowledge Bases** to find them. Leave empty to search every knowledge base the connected account can see. Example: `d6f5f5e2c0a80163014dc5657dc3ae90`.",
      optional: true,
    },
    limit: {
      propDefinition: [
        servicenow,
        "limit",
      ],
    },
    fields: {
      propDefinition: [
        servicenow,
        "fields",
      ],
      description: "Additional `kb_knowledge` fields to return under `fields` for each article. Example: `short_description`, `sys_class_name`.",
    },
  },
  async run({ $ }) {
    const response = await this.servicenow.searchKnowledgeArticles({
      $,
      params: {
        query: this.query,
        kb: this.knowledgeBaseIds?.join(","),
        limit: this.limit,
        fields: this.fields?.join(","),
      },
    });

    const articles = response?.articles ?? [];
    $.export("$summary", `Found ${articles.length} knowledge article(s) matching "${this.query}"`);

    return response;
  },
};
