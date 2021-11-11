import reddit from "../../reddit.app.mjs";
import get from "lodash/get.js";
import { axios } from "@pipedream/platform";

export default {
  type: "action",
  key: "reddit-list-subreddits",
  version: "0.0.1",
  name: "List Subreddits",
  description: "List subreddits based in a search criteria. [See the docs here](https://www.reddit.com/dev/api/#GET_subreddits_search)",
  props: {
    reddit,
    subreddit: {
      propDefinition: [
        reddit,
        "subreddit",
      ],
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
      type: "string",
      label: "Sort",
      description: "One of: `relevance`, `activity`",
      options: [
        "relevance",
        "activity",
      ],
      optional: true,
    },
    showUsers: {
      type: "boolean",
      label: "Show Users",
      description: "A boolean value",
      optional: true,
    },
    srDetails: {
      type: "boolean",
      label: "Subreddit Details",
      description: "Expand Subreddits",
      optional: true,
    },
    typeaheadActive: {
      type: "boolean",
      label: "Typeahead Active",
      description: "Boolean value or None",
      optional: true,
    },
    show: {
      type: "string",
      label: "Show",
      description: "The string `all`",
      optional: true,
    },
    searchQueryId: {
      type: "string",
      label: "Search Queue ID",
      description: "An `uuid`",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      q: get(this.subreddit, "value", this.subreddit),
      limit: this.limit,
      show_users: this.showUsers,
      sort: this.sort,
      sr_detail: this.srDetails,
      typeahead_active: this.typeaheadActive,
      before: this.before,
      after: this.after,
      count: this.count,
      search_query_id: this.searchQueryId,
    };

    const res = await axios($, this.reddit._getAxiosParams({
      method: "GET",
      path: "/subreddits/search",
      params,
    }));

    $.export("$summary", "Subreddits successfully fetched");
    return res;
  },
};
