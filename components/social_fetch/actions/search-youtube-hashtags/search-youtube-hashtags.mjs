import app from "../../social_fetch.app.mjs";

export default {
  key: "social_fetch-search-youtube-hashtags",
  name: "Search YouTube Hashtags",
  description: "Searches YouTube for hashtags matching a query. [See the documentation](https://app.socialfetch.dev/playground?path=/v1/youtube/search/hashtags&method=GET)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    hashtag: {
      propDefinition: [
        app,
        "searchQuery",
      ],
      label: "Hashtag",
      description: "Hashtag to search, e.g. `science` (leading `#` is optional). Plain string, no dropdown.",
    },
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchYoutubeHashtags({
      $,
      hashtag: this.hashtag,
      cursor: this.cursor,
    });
    $.export("$summary", `Successfully fetched YouTube hashtags matching "${this.hashtag}"`);
    return response;
  },
};
