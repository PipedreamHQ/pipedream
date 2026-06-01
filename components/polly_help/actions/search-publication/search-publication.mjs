import pollyHelp from "../../polly_help.app.mjs";

export default {
  key: "polly_help-search-publication",
  name: "Search Publication",
  description: "Search a publication for articles by keyword or phrase. Returns matching articles with ID, name, slug, content snippet, schema elements (content blocks), and collection IDs. Use this as the first step when finding articles by topic — pass a returned article `id` to **Get Article** for full content, or a `collections[].id` to **Get Collection** to explore the collection it belongs to. [See the documentation](https://docs.polly.help/api-reference/search)",
  version: "0.0.1",
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
      description: "Keyword or phrase to search for. Supports full-text search across article titles and content.",
    },
  },
  async run({ $ }) {
    const { data: { search } = {} } = await this.pollyHelp.search({
      $,
      variables: {
        query: this.query,
      },
    });
    $.export("$summary", `Found ${search?.results?.length ?? 0} results for query: ${this.query}`);
    return search;
  },
};
