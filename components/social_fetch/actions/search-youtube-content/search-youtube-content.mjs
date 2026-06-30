import app from "../../social_fetch.app.mjs";

export default {
  key: "social_fetch-search-youtube-content",
  name: "Search YouTube Content",
  description: "Searches YouTube for videos matching a query. [See the documentation](https://app.socialfetch.dev/playground?path=/v1/youtube/search&method=GET)",
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
      description: "Free-form search term to find YouTube videos, e.g. `space documentary`. Plain string, no dropdown.",
    },
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchYoutubeContent({
      $,
      query: this.query,
      cursor: this.cursor,
    });
    $.export("$summary", `Successfully fetched YouTube content matching "${this.query}"`);
    return response;
  },
};
