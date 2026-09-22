import app from "../../social_fetch.app.mjs";

export default {
  key: "social_fetch-search-instagram-reels",
  name: "Search Instagram Reels",
  description: "Searches Instagram for Reels matching a query. [See the documentation](https://app.socialfetch.dev/playground?path=/v1/instagram/search/reels&method=GET)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "searchQuery",
      ],
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchInstagramReels({
      $,
      query: this.query,
      page: this.page,
    });
    $.export("$summary", `Successfully fetched Instagram Reels matching "${this.query}"`);
    return response;
  },
};
