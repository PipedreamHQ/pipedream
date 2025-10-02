import serply from "../../serply.app.mjs";

export default {
  key: "serply-search-bing",
  name: "Search Bing",
  description: "Performs a Bing search using the Serply API. [See the documentation](https://serply.io/docs/operations/v1/b/search)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    serply,
    query: {
      propDefinition: [
        serply,
        "query",
      ],
      description: "The search query. [See the documentation here.](https://seosly.com/blog/bing-search-operators/)",
    },
  },
  async run({ $ }) {
    const response = await this.serply.searchBing({
      $,
      query: encodeURIComponent(this.query),
    });

    $.export("$summary", `Received ${response?.results?.length} results for Bing search`);
    return response;
  },
};
