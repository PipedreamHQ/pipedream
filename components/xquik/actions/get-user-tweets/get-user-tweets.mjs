import xquik from "../../xquik.app.mjs";

export default {
  key: "xquik-get-user-tweets",
  name: "Get User Tweets",
  description:
    "List recent public X/Twitter posts from a user with Xquik. [See the documentation](https://docs.xquik.com/api-reference/overview)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    xquik,
    userId: {
      propDefinition: [xquik, "userId"],
    },
    cursor: {
      propDefinition: [xquik, "cursor"],
    },
    includeReplies: {
      propDefinition: [xquik, "includeReplies"],
    },
    includeParentTweet: {
      propDefinition: [xquik, "includeParentTweet"],
    },
  },
  async run({ $ }) {
    const response = await this.xquik.getUserTweets({
      $,
      userId: this.userId,
      cursor: this.cursor,
      includeReplies: this.includeReplies,
      includeParentTweet: this.includeParentTweet,
    });

    $.export("$summary", "Successfully retrieved user tweets");
    return response;
  },
};
