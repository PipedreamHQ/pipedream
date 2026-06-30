import app from "../../social_fetch.app.mjs";

export default {
  key: "social_fetch-search-twitter-content",
  name: "Search Twitter Content",
  description: "Searches Twitter for posts/tweets matching a query. [See the documentation](https://app.socialfetch.dev/playground?path=/v1/twitter/search&method=GET)",
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
      description: "Free-form search term to find tweets, e.g. `artificial intelligence`. Plain string, no dropdown.",
    },
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchTwitterContent({
      $,
      query: this.query,
      cursor: this.cursor,
    });
    $.export("$summary", `Successfully fetched Twitter content matching "${this.query}"`);
    return response;
  },
};
