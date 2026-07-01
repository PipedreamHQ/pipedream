import app from "../../social_fetch.app.mjs";

export default {
  key: "social_fetch-search-tiktok-hashtags",
  name: "Search TikTok Hashtags",
  description: "Searches TikTok for hashtags matching a query. [See the documentation](https://app.socialfetch.dev/playground?path=/v1/tiktok/search/hashtags&method=GET)",
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
        "hashtag",
      ],
    },
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchTiktokHashtags({
      $,
      hashtag: this.hashtag,
      cursor: this.cursor,
    });
    $.export("$summary", `Successfully fetched TikTok hashtags matching "${this.hashtag}"`);
    return response;
  },
};
