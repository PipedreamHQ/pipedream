import reddit from "../../reddit.app.mjs";
import get from "lodash/get.js";
import { axios } from "@pipedream/platform";

export default {
  type: "action",
  key: "reddit-list-comments",
  version: "0.0.1",
  name: "List Comments",
  description: "List comments for a specific post. [See the docs here](https://www.reddit.com/dev/api/#GET_comments_{article})",
  props: {
    reddit,
    subreddit: {
      propDefinition: [
        reddit,
        "subreddit",
      ],
    },
    subredditPost: {
      propDefinition: [
        reddit,
        "subredditPost",
        ({ subreddit }) => ({
          subreddit,
        }),
      ],
    },
    numberOfParents: {
      propDefinition: [
        reddit,
        "numberOfParents",
      ],
    },
    depth: {
      propDefinition: [
        reddit,
        "depth",
      ],
    },
    includeSubredditDetails: {
      propDefinition: [
        reddit,
        "includeSubredditDetails",
      ],
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "The order of the comments",
      optional: true,
      options: [
        "confidence",
        "top",
        "new",
        "controversial",
        "old",
        "random",
        "qa",
        "live",
      ],
    },
  },
  async run({ $ }) {
    const {
      subreddit,
      subredditPost,
      numberOfParents,
      depth,
      includeSubredditDetails,
      sort,
    } = this;

    const res = await axios($, this.reddit._getAxiosParams({
      method: "GET",
      path: `/r/${get(subreddit, "value", subreddit)}/comments/article`,
      params: {
        article: get(subredditPost, "value", subredditPost),
        context: numberOfParents,
        depth: depth,
        sr_detail: includeSubredditDetails,
        threaded: true,
        sort: sort,
      },
    }));

    $.export("$summary", `Comments for "${get(subredditPost, "label", subredditPost)}" in "${get(subreddit, "label", subreddit)}" subreddit successfully fetched"`);
    return res;
  },
};
