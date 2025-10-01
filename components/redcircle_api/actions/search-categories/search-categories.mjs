import app from "../../redcircle_api.app.mjs";

export default {
  key: "redcircle_api-search-categories",
  name: "Search Categories",
  description: "Search for a category in Redcirle API. [See the documentation](https://docs.trajectdata.com/redcircleapi/categories-api/list-and-search)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    searchTerm: {
      propDefinition: [
        app,
        "searchTerm",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchCategories({
      $,
      params: {
        "search_term": this.searchTerm,
      },
    });
    $.export("$summary", "Successfully sent the request and retrieved " + response.categories.length + " categories");
    return response;
  },
};
