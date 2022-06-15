import reddit from "../../reddit.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  type: "action",
  key: "reddit-search-post",
  version: "0.0.1",
  name: "Search Post",
  description: "Search posts by title. [See the docs here](https://www.reddit.com/dev/api/#GET_search)",
  props: {
    reddit,
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

    const res = await axios($, this.reddit._getAxiosParams({
      method: "GET",
      path: "/r/subreddit/search",
      params,
    }));
    $.export("$summary", "Posts successfully fetched");

    return res;
  },
};
