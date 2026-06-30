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
      description: "Free-form search term to find Instagram Reels, e.g. `travel`. Plain string, no dropdown.",
    },
    page: {
      type: "integer",
      label: "Page",
      description: "1-based page number for pagination (integer). Defaults to page 1 when omitted.",
      optional: true,
      min: 1,
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
