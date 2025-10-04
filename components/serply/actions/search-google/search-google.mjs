import serply from "../../serply.app.mjs";

export default {
  key: "serply-search-google",
  name: "Search Google",
  description: "Performs a Google search using the Serply API. [See the documentation](https://serply.io/docs/operations/v1/search)",
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
    },
  },
  async run({ $ }) {
    const response = await this.serply.searchGoogle({
      $,
      query: encodeURIComponent(this.query),
    });

    $.export("$summary", `Received ${response?.results?.length} results for Google search`);
    return response;
  },
};
