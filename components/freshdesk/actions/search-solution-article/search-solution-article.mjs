import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-search-solution-article",
  name: "Search Solution Article",
  description: "Search solution articles in Freshdesk by keyword. Returns matching articles with their category/folder hierarchy, metadata, and content. [See the documentation](https://developers.freshdesk.com/api/#search_solutions)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    freshdesk,
    term: {
      type: "string",
      label: "Keyword",
      description: "Provide a search keyword to find matching solution articles.",
    },
  },
  async run({ $ }) {
    const results = await this.freshdesk.searchSolutions({
      $,
      term: this.term,
    });
    $.export("$summary", `Successfully found ${results.length} solution article${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
