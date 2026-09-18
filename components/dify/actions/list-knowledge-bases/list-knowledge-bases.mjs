import dify from "../../dify.app.mjs";

export default {
  key: "dify-list-knowledge-bases",
  name: "List Knowledge Bases",
  description: "List the knowledge bases (datasets) visible to your Dify account, optionally filtered by name. Use this to find the `Knowledge Base ID` needed by **Query Knowledge Base**. This requires a Dify connection authenticated with a knowledge base API key (issued from a knowledge base's own **API Access** page), not an app API key — those authenticate **Run Workflow** instead. A `401 unauthorized` error here usually means the connected account is using an app key; reconnect with a knowledge base key instead. [See the documentation](https://docs.dify.ai/en/api-reference/knowledge-bases/list-knowledge-bases)",
  version: "0.0.1",
  ai: "optimized",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    dify,
    keyword: {
      type: "string",
      label: "Keyword",
      description: "Filter knowledge bases by name, e.g. `Product Documentation`.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number of results to return. Defaults to `1`.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of knowledge bases to return per page. Defaults to `20`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dify.listDatasets({
      $,
      params: {
        keyword: this.keyword,
        page: this.page,
        limit: this.limit,
      },
    });

    $.export("$summary", `Found ${response.data.length} knowledge base(s)`);
    return response;
  },
};
