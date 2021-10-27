import reddit from "../../reddit.app.mjs";
import get from "lodash/get.js";

export default {
  type: "action",
  key: "reddit-action-list-subreddits",
  version: "0.0.18",
  name: "List Subreddits",
  description: "Create a post to a subreddit. [See the docs here](https://www.reddit.com/dev/api/#POST_api_submit)",
  props: {
    reddit,
    q: {
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
      description: "Sort of your queue",
      options: [
        "relevance",
        "activity",
      ],
      optional: true,
    },
    showUsers: {
      type: "boolean",
      label: "Show Users",
      description: "Show users of Sub Reddit",
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
  },
  async run() {
    const res = await this.reddit.searchSubreddits({
      q: this.q,
      limit: this.limit,
      show_users: this.showUsers,
      sort: this.sort,
      sr_detail: this.srDetails,
      typeahead_active: this.typeaheadActive,
      before: this.before,
      after: this.after,
    });
    return get(res, "data.children");
  },
};
