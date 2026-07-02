import app from "../../social_fetch.app.mjs";
import { truncateArrays } from "../../common/utils.mjs";

export default {
  key: "social_fetch-list-subreddit-posts",
  name: "List Subreddit Posts",
  description: "Get posts from a specific subreddit. [See the documentation](https://app.socialfetch.dev/playground?path=/v1/reddit/subreddits/%7Bsubreddit%7D/posts&method=GET)",
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
    sort: {
      propDefinition: [
        app,
        "sort",
      ],
    },
    timeframe: {
      propDefinition: [
        app,
        "timeframe",
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
    const MAX_POSTS = 10;
    const response = await this.app.listSubredditPosts({
      $,
      subreddit: this.subreddit,
      sort: this.sort,
      timeframe: this.timeframe,
      cursor: this.cursor,
    });
    truncateArrays(response?.data, MAX_POSTS);
    $.export("$summary", "Successfully listed subreddit posts");
    return response;
  },
};
