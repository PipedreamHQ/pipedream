import app from "../../groundsocial.app.mjs";

export default {
  key: "groundsocial-search-reddit-posts",
  name: "Search Reddit Posts",
  description: "Search posts across Reddit or in one subreddit. [See the documentation](https://groundsocial.dev/docs/api/reddit-search-posts)",
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
      type: "string",
      label: "Query",
      description: "Search words",
    },
    subreddit: {
      type: "string",
      label: "Subreddit",
      description: "Search only this subreddit, without `r/`",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Result order",
      options: [
        "relevance",
        "new",
        "top",
        "comments",
        "hot",
      ],
      default: "relevance",
      optional: true,
    },
    time: {
      type: "string",
      label: "Time",
      description: "Time window for `top`",
      options: [
        "hour",
        "day",
        "week",
        "month",
        "year",
        "all",
      ],
      default: "week",
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.callEndpoint({
      $,
      endpointId: "reddit.search.posts",
      params: {
        q: this.query,
        subreddit: this.subreddit,
        sort: this.sort,
        t: this.time,
        limit: this.limit,
      },
    });
    const posts = (response.data?.children ?? []).map((child) => child.data);
    $.export("$summary", `Found ${posts.length} post${posts.length === 1
      ? ""
      : "s"}`);
    return posts;
  },
};
