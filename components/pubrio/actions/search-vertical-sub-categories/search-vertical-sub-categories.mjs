import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-search-vertical-sub-categories",
  name: "Search Vertical Sub-Categories",
  description: "Search available vertical sub-categories by keyword. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/verticals/vertical_sub_categories)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pubrio,
    keyword: {
      type: "string",
      label: "Keyword",
      description: "Keyword to search vertical sub-categories",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};
    if (this.keyword) data.keyword = this.keyword;
    const response = await this.pubrio.searchVerticalSubCategories({
      $,
      data,
    });
    $.export("$summary", "Successfully retrieved vertical sub-categories");
    return response;
  },
};
