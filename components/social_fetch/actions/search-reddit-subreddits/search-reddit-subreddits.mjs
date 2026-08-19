import app from "../../social_fetch.app.mjs";
import { normalizeSubreddit } from "../../common/routing.mjs";

export default {
  key: "social_fetch-search-reddit-subreddits",
  name: "Search Reddit Subreddits",
  description: "Searches posts within a specific Reddit subreddit. [See the documentation](https://app.socialfetch.dev/playground?path=/v1/reddit/subreddits/search&method=GET)",
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
      type: "string",
      label: "Subreddit",
      description: "Subreddit name without the `r/` prefix, e.g. `programming`. Required.",
    },
    query: {
      propDefinition: [
        app,
        "searchQuery",
      ],
      optional: true,
    },
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const subreddit = normalizeSubreddit(this.subreddit);
    const response = await this.app.searchRedditSubreddits({
      $,
      subreddit,
      query: this.query,
      cursor: this.cursor,
    });
    $.export("$summary", `Successfully fetched Reddit posts from r/${subreddit}${this.query
      ? ` matching "${this.query}"`
      : ""}`);
    return response;
  },
};
