import reddit from "../../reddit.app.mjs";

export default {
  type: "action",
  key: "reddit-search-post",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Search Post",
  description: "Search posts by title. [See the docs here](https://www.reddit.com/dev/api/#GET_search)",
  props: {
    reddit,
    subreddit: {
      propDefinition: [
        reddit,
        "subreddit",
      ],
      description: "Search for a subreddit, or enter a subreddit display name as a custom expression (for example, `happycowgifs`).",
    },
    query: {
      label: "Query",
      description: "Query to search for posts",
      type: "string",
    },
    limit: {
      propDefinition: [
        reddit,
        "limit",
      ],
    },
    before: {
      propDefinition: [
        reddit,
        "before",
      ],
    },
    after: {
      propDefinition: [
        reddit,
        "after",
      ],
    },
    count: {
      propDefinition: [
        reddit,
        "count",
      ],
    },
    sort: {
      propDefinition: [
        reddit,
        "sort",
      ],
    },
    srDetails: {
      propDefinition: [
        reddit,
        "includeSubredditDetails",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      q: this.query,
      limit: this.limit,
      sort: this.sort,
      sr_detail: this.srDetails,
      before: this.before,
      after: this.after,
      count: this.count,
    };

    const res = await this.reddit.searchSubredditLinks(
      this.subreddit.value ?? this.subreddit,
      params,
    );

    $.export("$summary", "Posts successfully fetched");

    return res;
  },
};
