import app from "../../social_fetch.app.mjs";
import { truncateArrays } from "../../common/utils.mjs";

export default {
  key: "social_fetch-list-reddit-post-comments",
  name: "List Reddit Post Comments",
  description: "Get comments on a Reddit post. [See the documentation](https://app.socialfetch.dev/playground?path=/v1/reddit/posts/comments&method=GET)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "redditPostUrl",
      ],
    },
    trim: {
      propDefinition: [
        app,
        "trim",
      ],
    },
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const MAX_COMMENTS = 10;
    const response = await this.app.listPostComments({
      $,
      url: this.url,
      trim: this.trim,
      cursor: this.cursor,
    });
    truncateArrays(response?.data, MAX_COMMENTS);
    $.export("$summary", "Successfully listed post comments");
    return response;
  },
};
