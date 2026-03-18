import { axios } from "@pipedream/platform";
import reddit from "../../reddit.app.mjs";

export default {
  type: "action",
  key: "reddit-list-comments-in-a-post",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "List Comments in a Post",
  description: "List comments for a specific post. [See the docs here](https://www.reddit.com/dev/api/#GET_comments_{article})",
  props: {
    reddit,
    subreddit: {
      propDefinition: [
        reddit,
        "subreddit",
      ],
      description: "Search for a subreddit, or enter a subreddit display name as a custom expression (for example, `happycowgifs`).",
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
      description: "If set to `1`, include only new comments that are direct children to the subreddit pointed at by **Post**. Furthermore, `depth` determines the maximum depth of children, within the related subreddit comment tree, of new comments to be included.",
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
      path: `/r/${subreddit?.value || subreddit}/comments/article`,
      params: {
        article: subredditPost?.value || subredditPost,
        context: numberOfParents,
        depth: depth,
        sr_detail: includeSubredditDetails,
        threaded: true,
        sort: sort,
      },
    }));

    $.export("$summary", `Comments for "${subredditPost?.label || subredditPost}" in "${subreddit?.label || subreddit}" subreddit successfully fetched`);
    return res;
  },
};
