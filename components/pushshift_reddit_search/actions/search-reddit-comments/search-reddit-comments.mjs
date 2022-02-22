// legacy_hash_id: a_Q3iwn2
import { axios } from "@pipedream/platform";

export default {
  key: "pushshift_reddit_search-search-reddit-comments",
  name: "Search Reddit Comments",
  description: "Search Reddit comments using the Pushshift.io API. Learn more at https://github.com/pushshift/api",
  version: "0.1.1",
  type: "action",
  props: {
    pushshift_reddit_search: {
      type: "app",
      app: "pushshift_reddit_search",
    },
    q: {
      type: "string",
      description: "Search term. Will search ALL possible fields",
    },
    ids: {
      type: "string",
      description: "Get specific comments via their ids",
      optional: true,
    },
    size: {
      type: "integer",
      description: "Number of results to return\t(Integer <= 500)",
      optional: true,
    },
    fields: {
      type: "string",
      optional: true,
    },
    sort: {
      type: "string",
      description: "Sort results in a specific order (\"asc\" or \"desc\")",
      optional: true,
      options: [
        "asc",
        "desc",
      ],
    },
    sort_type: {
      type: "string",
      description: "Sort by a specific attribute",
      optional: true,
      options: [
        "score",
        "num_comments",
        "created_utc",
      ],
    },
    aggs: {
      type: "string",
      description: "Return aggregation summary",
      optional: true,
      options: [
        "author",
        "link_id",
        "created_utc",
        "subreddit",
      ],
    },
    author: {
      type: "string",
      description: "Restrict to a specific author",
      optional: true,
    },
    subreddit: {
      type: "string",
      description: "Restrict to a specific subreddit",
      optional: true,
    },
    after: {
      type: "string",
      description: "Return results after this date. Provide an epoch value or Integer + \"s,m,h,d\" (i.e. 30d for 30 days)",
      optional: true,
    },
    before: {
      type: "integer",
      description: "Return results before this date. Provide epoch value or Integer + \"s,m,h,d\" (i.e. 30d for 30 days)",
      optional: true,
    },
    frequency: {
      type: "string",
      description: "Used with the aggs parameter when set to created_utc",
      optional: true,
      options: [
        "second",
        "minute",
        "hour",
        "day",
      ],
    },
    metadata: {
      type: "boolean",
      description: "Include metadata search information",
      optional: true,
    },
  },
  async run({ $ }) {
    const options = {
      url: "https://api.pushshift.io/reddit/search/comment/",
      method: "get",
      params: {
        q: this.q,
        ids: this.ids,
        size: this.size,
        fields: this.fields,
        sort: this.sort,
        sort_type: this.sort_type,
        aggs: this.aggs,
        author: this.author,
        subreddit: this.subreddit,
        after: this.after,
        before: this.before,
        frequency: this.frequency,
        metadata: this.metadata,
      },
    };

    return (await axios($, options)).data;
  },
};
