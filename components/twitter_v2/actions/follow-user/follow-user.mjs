import twitter from "../../twitter.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "twitter-follow-user",
  name: "Follow User",
  description: "Follow a user specified by ID or screen name parameter. [See the docs here](https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/post-friendships-create)",
  version: "0.0.2",
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
      throw new ConfigurationError("This action requires either User ID or Screen Name. Please enter one or the other above.");
    }

    const params = {
      user_id: userId,
      screen_name: screenName,
    };
    const response = await this.twitter.followUser({
      params,
      $,
    });
    $.export("$summary", `Successfully followed user @${response.screen_name}`);
    return response;
  },
};
