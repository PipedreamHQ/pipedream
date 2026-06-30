import app from "../../social_fetch.app.mjs";

export default {
  key: "social_fetch-search-reddit-content",
  name: "Search Reddit Content",
  description: "Searches Reddit for posts matching a query. [See the documentation](https://app.socialfetch.dev/playground?path=/v1/reddit/search&method=GET)",
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
      description: "Free-form search term to find Reddit posts, e.g. `javascript tips`. Plain string, no dropdown.",
    },
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchRedditContent({
      $,
      query: this.query,
      cursor: this.cursor,
    });
    $.export("$summary", `Successfully fetched Reddit content matching "${this.query}"`);
    return response;
  },
};
