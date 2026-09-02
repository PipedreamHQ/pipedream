// x-pd-ai: optimized
import dify from "../../dify.app.mjs";

export default {
  key: "dify-list-knowledge-bases",
  name: "List Knowledge Bases",
  description: "List the knowledge bases (datasets) visible to your Dify account, optionally filtered by name. Use this to find the `Knowledge Base ID` needed by **Query Knowledge Base**. Dify's knowledge base endpoints require a knowledge base API key (from a knowledge base's own **API Access** page), which is a different key from the app API key used by **Send Chat Message** and **Run Workflow** — connect a separate Dify account in the `Dify` prop below using that key if your existing connection uses an app key. [See the documentation](https://docs.dify.ai/en/api-reference/knowledge-bases/list-knowledge-bases)",
  version: "0.0.1",
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
