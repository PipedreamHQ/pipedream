// legacy_hash_id: a_RAiaRw
import { axios } from "@pipedream/platform";

export default {
  key: "pushshift_reddit_search-search-reddit-posts",
  name: "Search Reddit Posts",
  description: "Search Reddit posts using the Pushshift.io API. Learn more at https://github.com/pushshift/api",
  version: "0.1.1",
  type: "action",
  props: {
    "pushshift_reddit_search": {
      type: "app",
      app: "pushshift_reddit_search",
    },
    "ids": {
      type: "string",
      description: "Get specific submissions via their ids",
      optional: true,
    },
    "q": {
      type: "string",
      description: "Search term. Will search ALL possible fields",
    },
    "q:not": {
      type: "string",
      description: "Exclude search term. Will exclude these terms",
      optional: true,
    },
    "title": {
      type: "string",
      description: "Searches the title field only",
      optional: true,
    },
    "title:not": {
      type: "string",
      description: "Exclude search term from title. Will exclude these terms",
      optional: true,
    },
    "selftext": {
      type: "string",
      description: "Searches the selftext field only",
      optional: true,
    },
    "selftext:not": {
      type: "integer",
      description: "Exclude search term from selftext. Will exclude these terms",
      optional: true,
    },
    "size": {
      type: "integer",
      description: "Number of results to return (Integer <= 500)",
      optional: true,
    },
    "fields": {
      type: "string",
      description: "Only return specific fields (comma delimited)",
      optional: true,
    },
    "sort": {
      type: "string",
      description: "Sort results in a specific order (\"asc\" or \"desc\")",
      optional: true,
      options: [
        "asc",
        "desc",
      ],
    },
    "sort_type": {
      type: "string",
      description: "Sort by a specific attribute",
      optional: true,
      options: [
        "score",
        "num_comments",
        "created_utc",
      ],
    },
    "aggs": {
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
    "author": {
      type: "string",
      description: "Restrict to a specific author",
      optional: true,
    },
    "subreddit": {
      type: "string",
      description: "Restrict to a specific subreddit",
      optional: true,
    },
    "after": {
      type: "string",
      description: "Return results after this date. Provide an epoch value or Integer + \"s,m,h,d\" (i.e. 30d for 30 days)",
      optional: true,
    },
    "before": {
      type: "integer",
      description: "Return results before this date. Provide epoch value or Integer + \"s,m,h,d\" (i.e. 30d for 30 days)",
      optional: true,
    },
    "score": {
      type: "string",
      description: "Restrict results based on score. Provide integer or > x or < x (i.e. score=>100 or score=<25)",
      optional: true,
    },
    "num_comments": {
      type: "string",
      description: "Restrict results based on number of comments. Integer or > x or < x (i.e. num_comments=>100)",
      optional: true,
    },
    "over_18": {
      type: "boolean",
      description: "Restrict to nsfw or sfw content",
      optional: true,
    },
    "is_video": {
      type: "boolean",
      description: "Restrict to video content",
      optional: true,
    },
    "locked": {
      type: "boolean",
      description: "Return locked or unlocked threads only",
      optional: true,
    },
    "stickied": {
      type: "boolean",
      description: "Return stickied or unstickied content only",
      optional: true,
    },
    "spoiler": {
      type: "boolean",
      description: "Exclude or include spoilers only",
      optional: true,
    },
    "content_mode": {
      type: "boolean",
      description: "Exclude or include content mode submissions",
      optional: true,
    },
    "frequency": {
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
    "metadata": {
      type: "boolean",
      description: "Include metadata search information",
      optional: true,
    },
  },
  async run({ $ }) {
    const options = {
      url: "https://api.pushshift.io/reddit/search/submission/",
      method: "get",
      params: {
        "ids": this.ids,
        "q": this.q,
        "q:not": this["q:not"],
        "title": this.title,
        "title:not": this["title:not"],
        "selftext": this.selftext,
        "selftext:not": this["selftext:not"],
        "size": this.size,
        "fields": this.fields,
        "sort": this.sort,
        "sort_type": this.sort_type,
        "aggs": this.aggs,
        "author": this.author,
        "subreddit": this.subreddit,
        "after": this.after,
        "before": this.before,
        "score": this.score,
        "num_comments": this.num_comments,
        "over_18": this.over_18,
        "is_video": this.is_video,
        "locked": this.locked,
        "stickied": this.stickied,
        "spoiler": this.spoiler,
        "content_mode": this.content_mode,
        "frequency": this.frequency,
        "metadata": this.metadata,
      },
    };

    return (await axios($, options)).data;
  },
};
