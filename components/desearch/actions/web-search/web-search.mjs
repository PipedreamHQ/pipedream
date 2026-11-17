import desearch from "../../desearch.app.mjs";

export default {
  key: "desearch-web-search",
  name: "Web Search",
  description: "Search the web with Desearch and return results containing titles, links, and snippets. [See the documentation](https://www.desearch.ai/docs/api-reference/get-web)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    desearch,
    query: {
      type: "string",
      label: "Query",
      description: "The web search query, e.g. `bittensor`.",
    },
  },
  async run({ $ }) {
    const response = await this.desearch.webSearch({
      $,
      params: {
        query: this.query,
      },
    });
    $.export("$summary", `Retrieved ${response.data.length} search results`);
    return response;
  },
};
