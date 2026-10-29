import desearch from "../../desearch.app.mjs";

export default {
  key: "desearch-web-search",
  name: "Web Search",
  description: "Search the web with Desearch and return results containing titles, links, and snippets.",
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
      description: "The web search query, for example `bittensor`.",
    },
    num: {
      type: "integer",
      label: "Number of Results",
      description: "The requested number of search results, for example `10`.",
      min: 1,
      default: 10,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.desearch.webSearch({
      $,
      params: {
        query: this.query,
        num: this.num,
      },
    });
    $.export("$summary", `Retrieved ${response.data.length} search results`);
    return response;
  },
};
