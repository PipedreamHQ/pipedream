import twitter from "../../twitter.app.mjs";

export default {
  key: "twitter-unfollow-user",
  name: "Unfollow user",
  description: "Unfollow the user specified by ID or screen name parameter. [See the docs here](https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/post-friendships-destroy)",
  version: "0.0.1",
  type: "action",
  props: {
    twitter,
    userId: {
      propDefinition: [
        twitter,
        "userId",
      ],
      optional: true,
    },
    screenName: {
      propDefinition: [
        twitter,
        "screenName",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      userId,
      screenName,
    } = this;

    if (!userId && !screenName) {
      throw new Error("This action requires either User ID or Screen Name. Please enter one or the other above.");
    }

    const params = {
      $,
      userId,
      screenName,
    };
    const res = await this.twitter.unfollowUser(params);
    $.export("$summary", "Successfully unfollowed user");
    return res;
  },
};
