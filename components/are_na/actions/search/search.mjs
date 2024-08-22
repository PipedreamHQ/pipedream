import are_na from "../../are_na.app.mjs";

export default {
  key: "are_na-search",
  name: "Perform a Search",
  description: "Search across all of Are.na (returns channels, blocks and users that match the query)",
  version: "0.0.1",
  type: "action",
  props: {
    are_na,
    query: {
      propDefinition: [
        are_na,
        "query",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.are_na.search({
      $,
      query: this.query,
    });

    $.export("$summary", `Search returned ${response.length} results`);
    return response;
  },
};
