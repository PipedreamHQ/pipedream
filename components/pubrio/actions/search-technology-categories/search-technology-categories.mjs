import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-search-technology-categories",
  name: "Search Technology Categories",
  description: "Search available technology categories by keyword. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/technologies/categories)",
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
      description: "Keyword to search technology categories",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};
    if (this.keyword) data.keyword = this.keyword;
    const response = await this.pubrio.searchTechnologyCategories({
      $,
      data,
    });
    $.export("$summary", "Successfully retrieved technology categories");
    return response;
  },
};
