import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-search-vertical-categories",
  name: "Search Vertical Categories",
  description: "Search available vertical categories by keyword. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  props: {
    pubrio,
    keyword: {
      type: "string",
      label: "Keyword",
      description: "Keyword to search vertical categories",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};
    if (this.keyword) data.keyword = this.keyword;
    const response = await this.pubrio.makeRequest({
      $,
      method: "POST",
      url: "/verticals/categories",
      data,
    });
    $.export("$summary", "Successfully retrieved vertical categories");
    return response;
  },
};
