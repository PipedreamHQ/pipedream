import common from "../common.mjs";

export default {
  ...common,
  key: "twitter-list-followers",
  name: "List Followers",
  description: "Return a collection of user objects for users following the specified user. [See the docs here](https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-followers-list)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    userId: {
      propDefinition: [
        common.props.twitter,
        "userId",
      ],
      optional: true,
    },
    screenName: {
      propDefinition: [
        common.props.twitter,
        "screenName",
      ],
      optional: true,
    },
    maxRequests: {
      propDefinition: [
        common.props.twitter,
        "maxRequests",
      ],
    },
    includeUserEntities: {
      propDefinition: [
        common.props.twitter,
        "includeUserEntities",
      ],
    },
  },
  async run({ $ }) {
    const {
      userId,
      screenName,
      maxRequests,
      includeUserEntities,
    } = this;

    if (!userId && !screenName) {
      throw new Error("This action requires either User ID or Screen Name. Please enter one or the other above.");
    }

    const params = {
      $,
      userId,
      screenName,
      maxRequests,
      includeUserEntities,
    };

    const followers = await this.paginate(this.twitter.getFollowers.bind(this), params, "users");
    const results = [];
    for await (const follower of followers) {
      results.push(follower);
    }
    $.export("$summary", "Successfully retrieved followers");
    return results;
  },
};
