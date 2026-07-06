import app from "../../social_fetch.app.mjs";

export default {
  key: "social_fetch-get-subreddit",
  name: "Get Subreddit",
  description: "Get metadata for a single Reddit community — title, description, subscriber counts, and icon/banner images when available. Use this to look up details about one subreddit; to fetch its posts use **List Subreddit Posts** instead. Provide the community as a bare name (`pics`), an `r/`-prefixed name (`r/pics`), or a full subreddit URL (`https://www.reddit.com/r/pics`); casing must match Reddit exactly. [See the documentation](https://app.socialfetch.dev/playground?path=/v1/reddit/subreddits&method=GET)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    subreddit: {
      propDefinition: [
        app,
        "subreddit",
      ],
    },
    url: {
      propDefinition: [
        app,
        "subredditUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getSubreddit({
      $,
      subreddit: this.subreddit,
      url: this.url,
    });
    $.export("$summary", "Successfully fetched subreddit details");
    return response;
  },
};
