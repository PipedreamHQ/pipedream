import reddit from "../../reddit.app.mjs";
import axios from "axios";
import get from "lodash/get.js";

export default {
  type: "action",
  key: "reddit-action-list-subreddits",
  version: "0.0.6",
  name: "List Sub-Reddits",
  description: "Create a post to a subreddit. [See the docs here](https://www.reddit.com/dev/api/#POST_api_submit)",
  props: {
    reddit,
    q: {
      propDefinition: [
        reddit,
        "subreddit",
      ],
    },
  },
  async run() {
    const res = await this.reddit.searchSubreddits(null, this.q);
    return get(res, "data.children");
  },
};
