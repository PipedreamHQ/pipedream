import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-search-technologies",
  name: "Search Technologies",
  description: "Search available technologies by keyword. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: true,
    readOnlyHint: true,
    destructiveHint: false,
  },
  props: {
    pubrio,
    keyword: {
      type: "string",
      label: "Keyword",
      description: "Keyword to search technologies",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};
    if (this.keyword) data.keyword = this.keyword;
    const response = await this.pubrio.searchTechnologies({
      $,
      data,
    });
    $.export("$summary", "Successfully retrieved technologies");
    return response;
  },
};
