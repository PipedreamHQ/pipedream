import serply from "../../serply.app.mjs";

export default {
  key: "serply-search-google",
  name: "Search Google",
  description: "Performs a Google search using the Serply API. [See the documentation](https://serply.io/docs/operations/v1/search)",
  version: "0.0.1",
  type: "action",
  props: {
    serply,
    query: {
      propDefinition: [
        serply,
        "query",
      ],
      description: "The search query. [See the documentation here.](https://moz.com/learn/seo/search-operators",
    },
  },
  async run({ $ }) {
    const response = await this.serply.searchGoogle({
      $,
      params: {
        q: encodeURIComponent(this.query),
      },
    });

    $.export("$summary", `Received ${response?.results?.length} results for Google search`);
    return response;
  },
};
