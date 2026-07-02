import app from "../../social_fetch.app.mjs";

export default {
  key: "social_fetch-get-subreddit",
  name: "Get Subreddit",
  description: "Get details for a Reddit community. [See the documentation](https://app.socialfetch.dev/playground?path=/v1/reddit/subreddits&method=GET)",
  version: "0.0.1",
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
