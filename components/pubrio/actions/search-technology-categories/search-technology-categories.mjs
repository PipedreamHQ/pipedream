import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-search-technology-categories",
  name: "Search Technology Categories",
  description: "Search available technology categories by keyword. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
  },
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
