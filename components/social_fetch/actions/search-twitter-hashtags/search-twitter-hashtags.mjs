import app from "../../social_fetch.app.mjs";

export default {
  key: "social_fetch-search-twitter-hashtags",
  name: "Search Twitter Hashtags",
  description: "Searches Twitter for hashtag data matching a query. [See the documentation](https://app.socialfetch.dev/playground?path=/v1/twitter/hashtags&method=GET)",
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
      description: "Hashtag to search, e.g. `AI` (leading `#` is optional). Plain string, no dropdown.",
    },
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchTwitterHashtags({
      $,
      hashtag: this.hashtag,
      cursor: this.cursor,
    });
    $.export("$summary", `Successfully fetched Twitter hashtags matching "${this.hashtag}"`);
    return response;
  },
};
