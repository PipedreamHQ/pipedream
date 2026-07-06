import app from "../../social_fetch.app.mjs";
import { truncateArrays } from "../../common/utils.mjs";

export default {
  key: "social_fetch-list-subreddit-posts",
  name: "List Subreddit Posts",
  description: "List posts from a single subreddit, with optional sorting (`best`, `hot`, `new`, `top`, `rising`) and a timeframe for time-based sorts (`all`, `day`, `week`, `month`, `year`). Use this to browse or page through a community's feed; for details about the community itself use **Get Subreddit**, and to read a specific post's replies use **List Reddit Post Comments**. Accepts the subreddit as a bare name (`pics`), an `r/`-prefixed name (`r/pics`), or a subreddit URL. Page through results with the cursor. [See the documentation](https://app.socialfetch.dev/playground?path=/v1/reddit/subreddits/%7Bsubreddit%7D/posts&method=GET)",
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
    $.export("$summary", `Successfully listed ${response?.data?.length ?? 0} subreddit posts`);
    return response;
  },
};
