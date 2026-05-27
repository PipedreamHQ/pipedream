import pollyHelp from "../../polly_help.app.mjs";

export default {
  key: "polly_help-search-publication",
  name: "Search Publication",
  description: "Search a publication for relevant content. [See the documentation](https://docs.polly.help/api-reference/search)",
  version: "0.0.{{ts}}",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pollyHelp,
    query: {
      type: "string",
      label: "Query",
      description: "The query to search for.",
    },
  },
  async run({ $ }) {
    const response = await this.pollyHelp.search({
      $,
      variables: {
        query: this.query,
      },
    });
    $.export("$summary", `Found ${response.data.search.searchinfo.nbHits} results for query: ${this.query}`);
    return response;
  },
};
